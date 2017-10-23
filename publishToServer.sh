#!/usr/bin/sh

HOUR_TEMP=$(date +%H)
HOUR=$((10#${HOUR_TEMP}+8))
if [ $HOUR -lt 10 ]
then
  HOUR="0"+"$HOUR_TEMP"
fi
DATE="$(date +%Y%m%d)""$HOUR""$(date +%M%S)"
echo "Timestamp: $DATE"
echo ""


if [[ $# != 0 && $# != 1 ]]
then
  echo '参数不符，直接退出'
  exit 0
fi

if [ $# == 0 ]
then
  echo '================== 测试服务器 ==================='
  echo 'genearate / g    --打包生成代码'
  echo 'deploy / d       --部署到指定服务器'
  echo 'auto             --打包生成代码 并 部署到指定服务器'
  echo ''
  echo '================== 正式服务器 ==================='
  echo 'genearateN / gN    --打包生成代码'
  echo 'deployN / dN       --部署到指定服务器'
  echo 'autoN              --打包生成代码 并 部署到指定服务器'
  echo ''
  echo 'Please input the taskName which u want to excute:'
  read arg
fi


if [[ $1 = 'help' || $1 = 'h' ]]
then
  echo '================== 测试服务器 ==================='
  echo 'genearate / g    --打包生成代码'
  echo 'deploy / d       --部署到指定服务器'
  echo 'auto             --打包生成代码 并 部署到指定服务器'
  echo '================== 正式服务器 ==================='
  echo 'genearateN / gN    --打包生成代码'
  echo 'deployN / dN       --部署到指定服务器'
  echo 'autoN              --打包生成代码 并 部署到指定服务器'
  exit 0
fi

# ================== 测试服务器 ===================
if [[ $1 = 'generate' || $1 = 'g' || $arg = 'generate' || $arg = 'g' ]]
then
  echo '= 打包生成将要适用于*测试*服务器的代码 ='
  gulp publish-test
fi

if [[ $1 = 'deploy' || $1 = 'd' || $arg = 'deploy' || $arg = 'd' ]]
then
  echo '= 部署到*测试*服务器 ='
  ssh root@114.55.66.232 'rm -rf /usr/tomcat/apache-tomcat-test/webapps/admin'
  scp -r ./admin root@114.55.66.232:/usr/tomcat/apache-tomcat-test/webapps/
  ssh root@114.55.66.232 'cp -r /usr/tomcat/apache-tomcat-test/webapps/admin-dll/lib /usr/tomcat/apache-tomcat-test/webapps/admin/lib'
fi

if [[ $1 = 'auto' || $arg = 'auto' ]]
then
  echo '= 打包生成代码 并 部署到*测试*服务器 ='
  gulp publish-test
  ssh root@114.55.66.232 'rm -rf /usr/tomcat/apache-tomcat-test/webapps/admin'
  scp -r ./admin root@114.55.66.232:/usr/tomcat/apache-tomcat-test/webapps/
  ssh root@114.55.66.232 'cp -r /usr/tomcat/apache-tomcat-test/webapps/admin-dll/lib /usr/tomcat/apache-tomcat-test/webapps/admin/lib'
fi

if [[ $1 = 'testN' || $1 = 'tN' || $arg = 'testN' || $arg = 'tN' ]]
then
  ssh root@114.55.66.232 'cp -r /usr/tomcat/apache-tomcat-test/webapps/admin-dll/lib /usr/tomcat/apache-tomcat-test/webapps/admin/lib'
fi

# ================== 正式服务器 ===================
if [[ $1 = 'generateN' || $1 = 'gN' || $arg = 'generateN' || $arg = 'gN' ]]
then
  gulp publish-normal
fi

if [[ $1 = 'deployN' || $1 = 'dN' || $arg = 'deployN' || $arg = 'dN' ]]
then
  echo 'Please input password to confirm your action:'
  read password
  if [ $password = 'vksMng' ]
  then
    echo 'Do you want to cp the published code from the normal_server to local? [yes / no]'
    read answer
    if [[ $answer = 'yes' || $answer = 'y' ]]
    then
      mkdir /e/wanwucang/04.Source/02.Web/vks-manager-backup/$DATE
      scp -r root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/admin /e/wanwucang/04.Source/02.Web/vks-manager-backup/$DATE
      ssh root@120.27.157.191 'rm -rf /usr/local/apache-tomcat-7.0.68/webapps/admin'
      scp -r ./admin root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/
      ssh root@120.27.157.191 'cp -r /usr/local/apache-tomcat-7.0.68/webapps/admin-dll/lib /usr/local/apache-tomcat-7.0.68/webapps/admin/lib'
    elif [[ $answer = 'no' || $answer = 'n' ]]  
    then
      ssh root@120.27.157.191 'rm -rf /usr/local/apache-tomcat-7.0.68/webapps/admin'
      scp -r ./admin root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/
      ssh root@120.27.157.191 'cp -r /usr/local/apache-tomcat-7.0.68/webapps/admin-dll/lib /usr/local/apache-tomcat-7.0.68/webapps/admin/lib'
    fi
  fi
fi

if [[ $1 = 'autoN' || $arg = 'autoN' ]]
then
  echo '= 打包生成代码 并 部署到*正式*服务器 ='
  sleep 0.5s
  echo 'Please input password to confirm your action:'
  read password
  if [ $password = 'vksMng' ]
  then
    echo 'Do you want to cp the published code from the normal_server to local? [yes / no]'
    read answer
    if [[ $answer = 'yes' || $answer = 'y' ]]
    then
      mkdir /e/wanwucang/04.Source/02.Web/vks-manager-backup/$DATE
      scp -r root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/admin /e/wanwucang/04.Source/02.Web/vks-manager-backup/$DATE
      gulp publish-normal
      ssh root@120.27.157.191 'rm -rf /usr/local/apache-tomcat-7.0.68/webapps/admin'
      scp -r ./admin root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/
      ssh root@120.27.157.191 'cp -r /usr/local/apache-tomcat-7.0.68/webapps/admin-dll/lib /usr/local/apache-tomcat-7.0.68/webapps/admin/lib'
    elif [[ $answer = 'no' || $answer = 'n' ]]  
    then
      gulp publish-normal
      ssh root@120.27.157.191 'rm -rf /usr/local/apache-tomcat-7.0.68/webapps/admin'
      scp -r ./admin root@120.27.157.191:/usr/local/apache-tomcat-7.0.68/webapps/
      ssh root@120.27.157.191 'cp -r /usr/local/apache-tomcat-7.0.68/webapps/admin-dll/lib /usr/local/apache-tomcat-7.0.68/webapps/admin/lib'
    fi
  else
    echo 'Wrong password! Exit!'
  fi
fi