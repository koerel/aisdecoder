#! /bin/bash

netcat -u -v 192.168.1.76 4001

sleep 5

while read line
do
    echo -e "$line\n"
    sleep 1
done < nmea-sample