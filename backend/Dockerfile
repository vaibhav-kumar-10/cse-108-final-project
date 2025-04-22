FROM python:3.10.16-bookworm

# Set working directory
WORKDIR /app

# Copy app code
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# If gunicorn isn't in requirements.txt, uncomment the next line:
RUN pip install gunicorn

# Start the Flask app using Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]