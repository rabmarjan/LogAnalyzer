import { vertexFactory } from './vertex_factory';
import { edgeFactory } from './edge_factory';

export class Graph {
  constructor() {
    this.json = null;
    this.verticesById = {};
    this.edgesById = {};
    this.edgesByFrom = {};
    this.edgesByTo = {};
  }

  getVertexById(id) {
    return this.verticesById[id];
  }

  getVertices() {
    // We need a stable order for webcola
    // constraints don't work by anything other than index :(

    // Its safe to cache vertices because vertices are never added or removed from the graph. This is because
    // such changes also result in changing the hash of the pipeline, which ends up creating a new graph altogether.
    if (this.vertexCache === undefined) {
      this.vertexCache = Object.values(this.verticesById);
    }
    return this.vertexCache;
  }

  get processorVertices() {
    return this.getVertices().filter(v => v.isProcessor);
  }

  get colaVertices() {
    return this.getVertices().map(v => v.cola);
  }

  get edges() {
    return Object.values(this.edgesById);
  }

  get colaEdges() {
    return this.edges.map(e => e.cola);
  }

  update(jsonRepresentation) {
    this.json = jsonRepresentation;

    jsonRepresentation.vertices.forEach(vJson => {
      const existingVertex = this.verticesById[vJson.id];
      if (existingVertex !== undefined) {
        existingVertex.update(vJson);
      } else {
        const newVertex = vertexFactory(this, vJson);
        this.verticesById[vJson.id] = newVertex;
      }
    });

    jsonRepresentation.edges.forEach(eJson => {
      const existingEdge = this.edgesById[eJson.id];
      if (existingEdge !== undefined) {
        existingEdge.update(eJson);
      } else {
        const newEdge = edgeFactory(this, eJson);
        this.edgesById[eJson.id] = newEdge;
        if (this.edgesByFrom[newEdge.from.json.id] === undefined) {
          this.edgesByFrom[newEdge.from.json.id] = [];
        }
        this.edgesByFrom[newEdge.from.json.id].push(newEdge);

        if (this.edgesByTo[newEdge.to.json.id] === undefined) {
          this.edgesByTo[newEdge.to.json.id] = [];
        }
        this.edgesByTo[newEdge.to.json.id].push(newEdge);
      }
    });

    // These maps are what the vertices use for their .rank and .reverseRank getters
    this.vertexRankById = this._bfs().distances;

    // A separate rank algorithm used for formatting purposes
    this.verticesByLayoutRank = this.calculateVerticesByLayoutRank();

    // For layout purposes we treat triangular ifs, that is to say
    // 'if' vertices of rank N with both T and F children at rank N+1
    // in special ways to get a clean render.
    this.triangularIfGroups = this.calculateTriangularIfGroups();
  }

  verticesByRank() {
    const byRank = [];
    Object.values(this.verticesById).forEach(vertex => {
      const rank = vertex.rank;
      if (byRank[rank] === undefined) {
        byRank[rank] = [];
      }
      byRank[rank].push(vertex);
    });
    return byRank;
  }

  // Can only be run after layout ranks are calculated!
  calculateTriangularIfGroups() {
    return this.getVertices().filter(v => {
      return v.typeString === 'if' &&
              !v.outgoingVertices.find(outV => outV.layoutRank !== (v.layoutRank + 1));
    }).map(ifV => {
      const trueEdge = ifV.outgoingEdges.filter(e => e.when === true)[0];
      const falseEdge = ifV.outgoingEdges.filter(e => e.when === false)[0];
      const result = { ifVertex: ifV };
      if (trueEdge) {
        result.trueVertex = trueEdge.to;
      }
      if (falseEdge) {
        result.falseVertex = falseEdge.to;
      }
      return result;
    });
  }

  calculateVerticesByLayoutRank() {
    // We will mutate this throughout this function
    // to produce our output
    const result = this.verticesByRank();

    // Find the rank of a vertex in our output
    // Normally you'd grab that information from `vertex.layoutRank`
    // but since we're recomputing that here we need something directly linked
    // to the intermediate result
    const rankOf = (vertex) => {
      const foundRankVertices = result.find((rankVertices) => {
        return rankVertices.find(v => v === vertex);
      });
      return result.indexOf(foundRankVertices);
    };

    // This function is really an engine for applying rules
    // These rules are evaluated in order. Each rule can produce one 'promotion', that is it
    // can specify that a single vertex of rank N be promoted to rank N+1
    // These rules will be repeatedly invoked on a rank's vertices until the rule has no effect
    // which is determined by the rule returning `null`
    const promotionRules = [
      // Our first rule is that vertices that are pointed to by other nodes within the rank, but do
      // not point to other nodes within the rank should be promoted
      // This produces a more desirable layout by mostly eliminating horizontal links, which must
      // cross over other links thus creating a confusing layout most of the time.
      (vertices) => {
        const found = vertices.find((v) => {
          const hasIncomingOfSameRank = v.incomingVertices.find(inV => rankOf(inV) === rankOf(v));
          const hasOutgoingOfSameRank = v.outgoingVertices.find(outV => rankOf(outV) === rankOf(v));
          return hasIncomingOfSameRank && hasOutgoingOfSameRank === undefined;
        });
        if (found) {
          return found;
        }

        return null;
      },
      // This rule is quite simple, simply limiting the maximum number of nodes in a rank to 3.
      // Beyond this number the graph becomes too compact, links often start crossing over each other
      // and readability suffers
      (vertices) => {
        if (vertices.length > 3) {
          return vertices[0];
        }
        return null;
      }
    ];

    // This is the core of this function, wherein we iterate through the ranks and apply the rules
    for (let rank = 0; rank < result.length; rank++) {
      const vertices = result[rank];
      // Iterate through each rule
      promotionRules.forEach(rule => {
        let ruleConverged = false;
        // Execute each rule against the vertices within the rank until the rule has no more
        // mutations to make
        while(!ruleConverged) {
          const promotedVertex = rule(vertices, result);
          // If the rule has found a vertex to promote
          if (promotedVertex !== null) {
            const promotedIndex = vertices.indexOf(promotedVertex);
            // move the vertex found by the rule from this rank and move it to the next one
            vertices.splice(promotedIndex, 1)[0];
            // We may be making a new rank, if so we'll need to seed it with an empty array
            if (result[rank + 1] === undefined) {
              result[rank + 1] = [];
            }
            result[rank + 1].push(promotedVertex);
          } else {
            ruleConverged = true;
          }
        }
      });
    }

    // Set separated rank as a property on each vertex
    for (let rank = 0; rank < result.length; rank++) {
      const rankVertices = result[rank];
      rankVertices.forEach(v => v.layoutRank = rank);
    }

    return result;
  }

  get roots() {
    return this.getVertices().filter((v) => v.isRoot);
  }

  get leaves() {
    return this.getVertices().filter((v) => v.isLeaf);
  }

  get maxRank() {
    return Math.max.apply(null, this.getVertices().map(v => v.rank));
  }

  _getReverseVerticesByRank() {
    return this.getVertices().reduce((acc, v) => {
      const rank = v.reverseRank;
      if (acc.get(rank) === undefined) {
        acc.set(rank, []);
      }
      acc.get(rank).push(v);
      return acc;
    }, new Map());
  }

  _bfs() {
    return this._bfsTraversalUsing(this.roots, 'outgoing');
  }

  _reverseBfs() {
    return this._bfsTraversalUsing(this.leaves, 'incoming');
  }

  /**
   * Performs a breadth-first or reverse-breadth-first search
   * @param {array} startingVertices Where to start the search - either this.roots (for breadth-first) or this.leaves (for reverse-breadth-first)
   * @param {string} vertexType Either 'outgoing' (for breadth-first) or 'incoming' (for reverse-breadth-first)
   */
  _bfsTraversalUsing(startingVertices, vertexType) {
    const distances = {};
    const parents = {};
    const queue = [];
    const vertexTypePropertyName = `${vertexType}Vertices`;

    startingVertices.forEach((v) => {
      distances[v.id] = 0;
      queue.push(v);
    });
    while (queue.length > 0) {
      const currentVertex = queue.shift();
      const currentDistance = distances[currentVertex.id];

      currentVertex[vertexTypePropertyName].forEach((vertex) => {
        if (distances[vertex.id] === undefined) {
          distances[vertex.id] = currentDistance + 1;
          parents[vertex.id] = currentVertex;
          queue.push(vertex);
        }
      });
    }

    return { distances, parents };
  }
}
