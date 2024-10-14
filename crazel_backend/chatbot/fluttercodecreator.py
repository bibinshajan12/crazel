import os


# Function to parse and write each section to its respective file
def create_flutter_files(response, appname):
    base_dir = f'generate_apps/{appname}'
    
    # Define directory paths
    dirs = {
        'screens': f'{base_dir}/lib/screens',
        'widgets': f'{base_dir}/lib/widgets',
        'models': f'{base_dir}/lib/models',
        'services': f'{base_dir}/lib/services',
        'routes': f'{base_dir}/lib',
        'constants': f'{base_dir}/lib',
        'themes': f'{base_dir}/lib'
    }
    
    # Ensure base directory exists
    os.makedirs(base_dir, exist_ok=True)

    # Ensure subdirectories exist
    for key in dirs:
        os.makedirs(dirs[key], exist_ok=True)

    # Mapping of section headers to their respective file paths
    file_map = {
        '**`main.dart`**': f'{base_dir}/lib/main.dart',
        '**`pubspec.yaml`**': f'{base_dir}/pubspec.yaml',
        '**Screens (`/lib/screens`)**': dirs['screens'],
        '**Widgets (`/lib/widgets`)**': dirs['widgets'],
        '**Models (`/lib/models`)**': dirs['models'],
        '**Services (`/lib/services`)**': dirs['services'],
        '**Routes (`/lib/routes.dart`)**': f'{base_dir}/lib/routes.dart',
        '**Constants (`/lib/constants.dart`)**': f'{base_dir}/lib/constants.dart',
        '**Themes (`/lib/themes.dart`)**': f'{base_dir}/lib/themes.dart',
    }
    
    # Process each section
    current_section = None
    section_content = ""
    
    for line in response.splitlines():
        line = line.strip()
        
        # Detect a new section based on the heading
        if line in file_map:
            # If there's content from the previous section, write it to the appropriate file
            if current_section and section_content:
                write_to_file(file_map[current_section], section_content.strip())
            # Start a new section
            current_section = line
            section_content = ""
        else:
            # Accumulate content for the current section
            section_content += line + "\n"
    
    # Write the last section's content
    if current_section and section_content:
        write_to_file(file_map[current_section], section_content.strip())

# Function to write content to a file
def write_to_file(filepath, content):
    # Handle directories for files with multiple screens/widgets
    if isinstance(filepath, str):
        with open(filepath, 'w') as file:
            file.write(content)
    elif isinstance(filepath, dict):
        # Handle screen and widget content that contains multiple files
        parts = content.split('// ')
        for part in parts:
            if part.strip():  # Ignore empty parts
                lines = part.split('\n')
                filename = lines[0].strip()
                file_content = "\n".join(lines[1:]).strip()
                file_path = os.path.join(filepath, filename)
                with open(file_path, 'w') as file:
                    file.write(file_content)

# Call the function to create files from the response
app_name = 'my_flutter_app'  # Change this to any desired app name
create_flutter_files(response, app_name)

print(f"Flutter files have been created successfully in generate_apps/{app_name}!")
