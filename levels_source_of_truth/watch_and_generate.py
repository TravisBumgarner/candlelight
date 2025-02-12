import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import webbrowser
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

class VisualizationHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = 0
        # Minimum time between regenerations to prevent rapid successive updates
        self.cooldown = 1.0

    def on_modified(self, event):
        if event.src_path.endswith('.csv'):
            current_time = time.time()
            if current_time - self.last_modified > self.cooldown:
                self.last_modified = current_time
                print("CSV change detected, regenerating visualization...")
                subprocess.run(['python', './generate_visualization.py'])

def start_http_server():
    server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
    print("Starting HTTP server at http://localhost:8000/level_visualization.html")
    server.serve_forever()

def main():
    # Start HTTP server in a separate thread
    server_thread = threading.Thread(target=start_http_server, daemon=True)
    server_thread.start()

    # Set up file system observer
    observer = Observer()
    event_handler = VisualizationHandler()
    observer.schedule(event_handler, path='ingestion', recursive=False)
    observer.start()

    # Open the visualization in the default browser
    webbrowser.open('http://localhost:8000/level_visualization.html')

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

if __name__ == "__main__":
    main()