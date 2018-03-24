call "%~dp0x-pack-env.bat" || exit /b 1

set ES_CLASSPATH=!ES_CLASSPATH!;!ES_HOME!/plugins/x-pack/x-pack-security/*
