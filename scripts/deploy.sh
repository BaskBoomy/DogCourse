#!/bin/bash
chmod -R 777 /home/ec2-user/DogCourse

echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'npm run start:prod' >> /home/ec2-user/DogCourse/deploy.log 
npm run start:prod  >> /home/ec2-user/DogCourse/deploy.log