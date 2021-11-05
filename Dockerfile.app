FROM ngantuk-dependencies

WORKDIR /usr/src/app

COPY controllers controllers
COPY middleware middleware
COPY models models
COPY routes routes
COPY utils utils
COPY swagger.json swagger.json
COPY dbCon.js dbCon.js
COPY index.js index.js

EXPOSE 3000
CMD [ "node", "index.js" ]