
# DevTheme Studio - Developer Portfolio Builder

A real-time, customizable developer portfolio theme with live preview, project management, and data persistence.

![Portfolio Demo](https://via.placeholder.com/800x400?text=DevTheme+Studio+Preview)

## ✨ Features

- **Real-time Preview** - Changes reflect instantly as you type
- **Project Management** - Add, edit, and delete projects with technologies
- **Skill Management** - Add/remove skills with visual tags
- **Data Persistence** - Auto-saves to localStorage
- **Import/Export** - Backup and restore your portfolio as JSON
- **Social Links** - Customizable GitHub, LinkedIn, and Twitter profiles
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Accessibility** - Keyboard navigation and ARIA labels
- **Toast Notifications** - Visual feedback for all actions
- **Input Validation** - Email format, character limits, URL validation

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Start editing** - Use the sidebar controls to customize your portfolio
4. **Export your work** - Save your portfolio as JSON file

### File Structure
```
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
└── script.js       # Core functionality and interactivity
```

## 🎨 Customization Options

### Personal Information
- Full name & professional title
- Bio / summary (max 300 characters)
- Profile image URL
- Email & location

### Professional Skills
- Add unlimited skills
- Remove skills with one click
- Auto-saves your skill set

### Projects
- Create, edit, and delete projects
- Add project title, description, URL
- Tag technologies used in each project
- Each project has a unique ID for stable management

### Social Links
- GitHub username
- LinkedIn profile
- Twitter handle

## ⌨️ Keyboard Shortcuts

- `Ctrl + S` (or `Cmd + S`) - Export portfolio as JSON

## 💾 Data Management

- **Auto-save** - All changes are automatically saved to your browser
- **Export** - Download your portfolio as a JSON file
- **Import** - Upload previously exported JSON files
- **Reset** - Restore default portfolio (requires confirmation)

## 🛠️ Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Variables, Animations)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter, JetBrains Mono)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 🔧 Development

### Prerequisites
- Any modern web browser
- Text editor (VS Code recommended)
- Live server (optional, for local development)

### Running Locally
```bash
# Using Python (optional)
python -m http.server 8000

# Using Live Server extension in VS Code
# Right-click index.html > Open with Live Server
```

### Making Changes
- Edit `index.html` for structural changes
- Modify `style.css` for styling
- Update `script.js` for functionality

## 📤 Export Format Example
```json
{
  "name": "Alex Morgan",
  "title": "Senior Developer",
  "skills": ["React", "Node.js"],
  "projects": [...],
  "exportedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Use Cases

- **Personal portfolio** for developers
- **Freelancer showcase** for clients
- **Student portfolio** for job applications
- **Developer theme** for content creators
- **Rapid prototyping** for portfolio designs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - Free for personal and commercial use

## 🙋‍♂️ Support

For issues or questions:
- Check browser console for errors
- Ensure localStorage is enabled
- Clear browser cache if experiencing issues
- Open an issue on GitHub

## 🎨 Preview Features

- **Live Sidebar Controls** - All inputs update preview in real-time
- **Project Cards** - Visual project display with hover effects
- **Skill Chips** - Color-coded technology tags
- **Contact Links** - Interactive social media buttons
- **Responsive Grid** - Adapts to different screen sizes

## 🚦 Status

**Version:** 2.0.0  
**Status:** Production-ready  
**Last Updated:** 2026

---

Made with ❤️ for developers who want to showcase their work beautifully
```
