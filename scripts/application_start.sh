#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/DogCourse/deploy.log

echo 'pm2 restart dogcourse-server' >> /home/ec2-user/DogCourse/deploy.log
pm2 restart dogcourse-server >> /home/ec2-user/DogCourse/deploy.log