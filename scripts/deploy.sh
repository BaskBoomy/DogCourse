#!/bin/bash
echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'pm2 restart dogcourse-server' >> /home/ec2-user/DogCourse/deploy.log 
pm2 restart dogcourse-server  >> /home/ec2-user/DogCourse/deploy.log