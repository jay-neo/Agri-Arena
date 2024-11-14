# Use the official Espressif ESP-IDF image
FROM espressif/idf

# Set working directory inside the container
WORKDIR /project

# Install required packages
RUN apt-get update && \
    apt-get install -y python3-venv python3-pip qemu-system-xtensa && \
    apt-get clean

# Create a Python virtual environment
RUN python3 -m venv /venv

# Set environment variables for the virtual environment
ENV PATH="/venv/bin:$PATH"

# Install PlatformIO in the virtual environment
RUN pip install platformio

# Set up PlatformIO environment
RUN platformio platform install espressif32

# Copy the project files into the container
COPY . /project

# Command to build the project with PlatformIO
CMD ["sh", "    .sh"]
