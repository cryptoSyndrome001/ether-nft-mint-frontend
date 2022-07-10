npm run build

rm -rf ./*.tar.gz

tar zcvf cryptagend.tar.gz ./build

scp -r ./cryptagend.tar.gz blog:/www/demo
ssh -tt blog << remotessh
cd /www/demo
rm -rf ./app
tar zxvf ./cryptagend.tar.gz
mv ./build ./app
rm -rf ./*.tar.gz
exit
remotessh
