FROM registry.ng.bluemix.net/ibmnode
ADD ./websocket_chat /chat
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "/chat/app.js"]
