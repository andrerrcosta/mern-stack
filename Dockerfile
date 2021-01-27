FROM node:14.15.4

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

# IT MEANS COPY FROM . TO . THAT MEANS THE CURRENT PATH TO THE ROOT PATH
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]