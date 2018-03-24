# LogAnalyzer

### How to Run LogAnalyzer Project

1. Clone From Repository LogAnalyzer
```bash
$ git clone https://github.com/rabmarjan/LogAnalyzer.git
```
2. Put Project Path to .bashrc file and name the variable ``LOGANALYZER``
```bash
$ vi .bashrc
$ export LOGANALYZER=your_path/LogAnalyzer
$ source .bashrc
$ sudo chmod u+x start.sh
$ ./start.sh
```
3. You can configure them with writing your own config file and put the config file to prpoer location of start.sh file
4. There is a password file `password.txt` put password to Kibana from this file.
5. You can also change the password changing password in Elasticsearch
6. Run Kibana from this url `localhost:5601`
