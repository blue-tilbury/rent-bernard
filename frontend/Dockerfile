FROM node:16-alpine
WORKDIR /frontend
EXPOSE 43000
RUN npm run build
CMD ["npm", "serve", "build"]
