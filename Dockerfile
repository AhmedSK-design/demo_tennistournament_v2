FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/demo_tennistournament_v3-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]  

# End of Dockerfile