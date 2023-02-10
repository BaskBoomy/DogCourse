#!/bin/bash
echo 'run before_install.sh: ' >> /home/ec2-user/DogCourse/deploy.log

echo 'cd /home/ec2-user/DogCourse' >> /home/ec2-user/DogCourse/deploy.log
cd /home/ec2-user/DogCourse >> /home/ec2-user/DogCourse/deploy.log

echo 'git submodule init' >> /home/ec2-user/DogCourse/deploy.log
git submodule init

echo 'git submodule update --recursive' >> /home/ec2-user/DogCourse/deploy.log
git submodule update --recursive