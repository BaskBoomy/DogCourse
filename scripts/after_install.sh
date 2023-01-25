#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/DogCourse/deploy.log

echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'npm install' >> /home/ec2-user/DogCourse/deploy.log 
npm install >> /home/ec2-user/DogCourse/deploy.log