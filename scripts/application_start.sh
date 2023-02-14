#!/bin/bash
echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'pm2 reload ecosystem.config.js --env production' >> /home/ec2-user/DogCourse/deploy.log 
pm2 reload ecosystem.config.js >> /home/ec2-user/DogCourse/deploy.log