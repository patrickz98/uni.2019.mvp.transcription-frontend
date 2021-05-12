FROM node:latest
EXPOSE 3000

# Create app directory
WORKDIR /app
COPY ./ /app

RUN npm install

CMD ["npm", "start"]

# docker build -t chicken-frontend .
# docker run -it --rm -p 3000:3000 chicken-frontend
