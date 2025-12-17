import http.server
import socketserver
import os
import json
import re
import urllib.request
import urllib.parse

PORT = 8080
UPLOAD_DIR = 'assets/images'
DATA_FILE = 'js/data.js'

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class AdminHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/projects':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            projects = self.get_projects_from_file()
            self.wfile.write(json.dumps(projects).encode())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/add_project':
            self.handle_add_project()
        elif self.path == '/api/save_projects':
            self.handle_save_projects()
        elif self.path == '/api/upload_image':
            self.handle_upload_image()
        else:
            self.send_error(404)

    def get_projects_from_file(self):
        try:
            if not os.path.exists(DATA_FILE):
                return {}
                
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract the JSON object inside const portfolioData = { ... };
            match = re.search(r'const portfolioData = ({[\s\S]*?});', content)
            if match:
                json_str = match.group(1)
                return json.loads(json_str)
            return {}
        except Exception as e:
            print(f"Error reading data.js: {e}")
            return None # Return None to indicate failure

    def save_data_to_file(self, data):
        if not data:
            print("Error: Attempted to save empty or invalid data.")
            return False
            
        try:
            json_str = json.dumps(data, indent=4)
            content = f"const portfolioData = {json_str};\n"
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing data.js: {e}")
            return False

    def handle_add_project(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)
            github_url = data.get('url')

            if not github_url:
                self.send_error(400, "Missing URL")
                return

            # Fetch GitHub metadata
            # Extract owner and repo from URL
            match = re.search(r'github\.com/([^/]+)/([^/]+)', github_url)
            if not match:
                self.send_error(400, "Invalid GitHub URL")
                return
            
            owner, repo = match.groups()
            api_url = f"https://api.github.com/repos/{owner}/{repo}"
            
            req = urllib.request.Request(api_url)
            req.add_header('User-Agent', 'Python Admin Tool')
            
            with urllib.request.urlopen(req) as response:
                repo_data = json.loads(response.read())

            new_project = {
                "id": repo_data['name'],
                "name": repo_data['name'].replace('-', ' ').title(),
                "tagline": repo_data['description'] or "No description available.",
                "description": repo_data['description'] or "No description available.",
                "image": None, # User will add this later
                "sourceUrl": github_url,
                "tech": repo_data.get('topics', [])
            }
            
            if repo_data.get('homepage'):
                new_project['liveUrl'] = repo_data['homepage']

            # Add to data
            portfolio_data = self.get_projects_from_file()
            if portfolio_data is None:
                self.send_error(500, "Could not read existing data. Aborting save to prevent data loss.")
                return

            if 'projectData' not in portfolio_data:
                portfolio_data['projectData'] = []
            
            # Add to top
            portfolio_data['projectData'].insert(0, new_project)
            
            if self.save_data_to_file(portfolio_data):
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'project': new_project}).encode())
            else:
                self.send_error(500, "Failed to save data")

        except Exception as e:
            print(f"Error processing add project: {e}")
            self.send_error(500, str(e))

    def handle_save_projects(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            new_projects_list = json.loads(body)

            portfolio_data = self.get_projects_from_file()
            if portfolio_data is None:
                self.send_error(500, "Could not read existing data. Aborting save to prevent data loss.")
                return

            portfolio_data['projectData'] = new_projects_list
            
            if self.save_data_to_file(portfolio_data):
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            else:
                self.send_error(500, "Failed to save data")
        except Exception as e:
            print(f"Error saving projects: {e}")
            self.send_error(500, str(e))

    def handle_upload_image(self):
        try:
            content_type = self.headers['Content-Type']
            boundary = content_type.split("boundary=")[1].encode()
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            parts = body.split(b'--' + boundary)
            
            project_id = None
            file_data = None
            filename = None

            for part in parts:
                if b'name="projectId"' in part:
                    project_id = part.split(b'\r\n\r\n')[1].strip().decode()
                elif b'name="image";' in part:
                    headers_part, content_part = part.split(b'\r\n\r\n', 1)
                    file_data = content_part.rsplit(b'\r\n', 1)[0]
                    headers = headers_part.decode()
                    match = re.search(r'filename="(.+?)"', headers)
                    if match:
                        filename = match.group(1)

            if project_id and file_data and filename:
                # Sanitize project_id
                project_id = re.sub(r'[^a-zA-Z0-9_-]', '', project_id)
                
                # Validate extension
                ext = os.path.splitext(filename)[1].lower()
                if ext not in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
                    self.send_error(400, "Invalid file type. Only images allowed.")
                    return

                new_filename = f"{project_id}{ext}"
                file_path = os.path.join(UPLOAD_DIR, new_filename)
                
                with open(file_path, 'wb') as f:
                    f.write(file_data)
                
                # Update data.js
                portfolio_data = self.get_projects_from_file()
                if portfolio_data:
                    for project in portfolio_data.get('projectData', []):
                        if project['id'] == project_id:
                            project['image'] = file_path.replace('\\', '/')
                            break
                    self.save_data_to_file(portfolio_data)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'newPath': file_path.replace('\\', '/')}).encode())
            else:
                self.send_error(400, "Missing data")
        except Exception as e:
            print(f"Error uploading image: {e}")
            self.send_error(500, str(e))

print(f"Starting Admin Server on port {PORT}...")
print(f"Open http://localhost:{PORT}/admin.html")

with socketserver.TCPServer(("", PORT), AdminHandler) as httpd:
    httpd.serve_forever()
