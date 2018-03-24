#!/usr/bin/env bash

RED='\033[0;31m'
BLUE='\e[0;34m'
GREEN='\e[0;32m'
NC='\e[0m'

printf "${GREEN}Put Elasticsearch and all app in any single directory and export its path to .bashrc or .profile file${NC}\n"
LogAnalyzer=${LOGANALYZER}  #### Put the Name exported path variable into the bracket
if [[ -n $(find ${LogAnalyzer} -name "elasticsearch" 2>/dev/null) ]]; then
   cd $LogAnalyzer
   printf "${GREEN} LogAnalyzer Directory found..${NC}\n"
elif [ -d ~/Documents/LogAnalyzer ]; then
    cd ~/Documents/LogAnalyzer
else
    printf "${RED}LogAnalyzer Directory Not Found${NC}\n"
    printf "${RED}Other Process Skiped...${NC}\n"
    exit 1
fi
ROOT_PATH="."
printf "${GREEN}Or Run This Shell script at same directory of Elasticsearch, Kibana, Logstash and filebeat${NC}\n"

function elasticStart(){
    echo "Elasticsearch Running Process initiate...."
    if [ -d elasticsearch ]; then
       if [[ $(jps | grep Elasticsearch) ]]; then
          echo "There are already running elastic instance"
          pkill -f elasticsearch
          echo "Cleaning previous Elasticsearch process"
          sleep 5
       fi
       cd $ROOT_PATH/elasticsearch/bin
       ./elasticsearch -Ecluster.name=cluster_log_analyzer -Enode.name=node_log_analyzer -p /tmp/elasticsearch-pid -d
       cd $OLDPWD
       echo "Starting elasticsearch.... "
       sleep 5
       if [[ $(cat /tmp/elasticsearch-pid && echo) ]]; then
          printf "${GREEN}Elasticsearch successfully start${NC}\n"
       fi
    else
       printf "${RED}Run Elasticsearch where elasticsearch/bin directory located${NC}\n"
       printf "${RED}Elasticsearch failed to start${NC}\n"
       printf "${RED}Other Process Skiped...${NC}\n"
       exit 1
    fi
}

function kibanaStart(){
    echo "Starting kibana.... "
    if [ -d kibana ]; then
       cd $ROOT_PATH/kibana/bin
       ./kibana &
       cd $OLDPWD
       printf "${GREEN}Kibana started....${NC}\n"
       sleep 5
    else
        printf "${RED}Kibana fail to start${NC}\n"
        exit 1
    fi
}

function fileBeatStart(){
    printf "${GREEN} Filebeat starting process initiate....${NC}\n"
    pkill -f filebeat
    printf "${GREEN}Cleanead up existing filebeat instance${NC}\n"
    cd $ROOT_PATH/filebeat
    ./filebeat -c filebeat.yml -e
    sleep 5
    printf "${GREEN}File beat Process Started...${NC}\n"
    ./filebeat setup -e
    printf "${GREEN}Inserted filebit data to Kibana${NC}\n"
    cd $OLDPWD
    sleep 5
}

function logstashStart(){
    echo "Starting logstash.... "
    if [ -d logstash ]; then
       cd $ROOT_PATH/logstash
       bin/logstash -f logstash.conf
       cd $OLDPWD
       printf "${GREEN}Logstash started....${NC}\n"
    else
       printf "${RED}Logstash fail to start${NC}\n"
    fi
}

function main(){
    elasticStart
    kibanaStart
    fileBeatStart
    logstashStart
}
main
