## Setting up a new Nest.js Project


```
npm run start:dev
```


```
gcloud builds submit --project pragmatic-parking-dev --config cloudbuild.yaml --substitutions=$(gcloud beta builds triggers describe pragmatic-parking-service-deploy --format json  --project pragmatic-parking-dev | jq -r '.substitutions | to_entries | map(.key + "=" + (.value | tostring)) |  join(",")')
```


## ToDo:
- [ ] create api to call from the box
