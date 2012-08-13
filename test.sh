for service in `cat lib/api.rb  | grep 'transport("' | sed -e 's/transport("\(.*\)").get("\(.*\)").data/\1\2/'`; do
  response_code=`curl -o /dev/null -s -w "%{http_code}" $service`
  if [ $response_code -ne "200" ]; then
    echo "Service not working properly: $service, responded with: $response_code"
  fi
done
