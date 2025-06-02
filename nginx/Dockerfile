FROM nginx:alpine

# Copy custom configuration file
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"] 