#!/bin/bash
echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'pm2 restart Dog-Course-Server' >> /home/ec2-user/DogCourse/deploy.log 
# pm2 restart Dog-Course-Server  >> /home/ec2-user/DogCourse/deploy.log