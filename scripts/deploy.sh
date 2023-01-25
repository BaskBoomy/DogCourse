#!/bin/bash
echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'npm run pm2' >> /home/ec2-user/DogCourse/deploy.log 
npm run pm2  >> /home/ec2-user/DogCourse/deploy.log