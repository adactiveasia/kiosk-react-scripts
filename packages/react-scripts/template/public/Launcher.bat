@ECHO OFF
for /f tokens^=1-6^ delims^=v.-_^" %%j in ('node --version 2^>^&1') do @set "nodever=%%j%%k%%l%%m"

if %nodever% LSS 570 (
    for /f %%i in ('node --version 2^>^&1') do @set currentnode=%%i
    echo ERROR - Using Node %currentnode%
    echo Install Node v5.7.0 or higher
    EXIT /B 1
)
@ECHO ON
start node startServer --port 9001 --xml_file ./config.xml --data_folder ./local
timeout /t 10

