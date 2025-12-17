# 1. Use an official Python image with pip included
FROM python:3.11-slim

# 2. Set working directory
WORKDIR /app

# 3. Install system deps (if your requirements need DB drivers etc)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    default-mysql-client \
 && rm -rf /var/lib/apt/lists/*

# 4. Copy and install backend requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 5. Copy the rest of the project
COPY . /app

# 6. Environment
ENV PYTHONUNBUFFERED=1

# 7. Expose FastAPI port
EXPOSE 8000

# 8. Start FastAPI via Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
