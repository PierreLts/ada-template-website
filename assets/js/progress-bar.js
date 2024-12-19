class ProgressBar {
    constructor() {
      // Manually define sections and their hierarchies
      this.sectionsList = [
        { title: "Introduction", level: "h1", id: "introduction" },
        { title: "Preliminary Analysis", level: "h1", id: "preliminary-analysis" },
        { title: "Sentiment Analysis", level: "h1", id: "sentiment-analysis" },
        { title: "Network Analysis", level: "h1", id: "network-analysis" },
        { title: "Network Analysis", level: "h1", id: "network-analysis" },
        { title: "Results", level: "h1", id: "results" },
      ];
  
      this.progressContainer = document.createElement('div');
      this.progressBar = document.createElement('div');
      this.sectionMarkers = document.createElement('div');
      this.init();
    }
  
    init() {
      this.progressContainer.className = 'vertical-progress-container';
      this.progressBar.className = 'vertical-progress-bar';
      this.sectionMarkers.className = 'section-markers';
  
      this.progressContainer.appendChild(this.progressBar);
      this.progressContainer.appendChild(this.sectionMarkers);
      document.body.appendChild(this.progressContainer);
  
      // Create markers for predefined sections
      this.sectionsList.forEach((section, index) => {
        this.createSectionMarker(section, index);
      });
  
      // Position the markers correctly when the page is first loaded
      this.updateMarkerPositions();
  
      window.addEventListener('scroll', () => this.updateProgress());
      window.addEventListener('resize', () => this.updateMarkerPositions());
      this.updateProgress();
    }
  
    createSectionMarker(section, index) {
        const marker = document.createElement('div');
        marker.className = 'section-marker';
        marker.setAttribute('data-level', section.level);
      
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = section.title;
      
        const line = document.createElement('div');
        line.className = 'section-marker-line';
      
        marker.appendChild(title);
        marker.appendChild(line);
        this.sectionMarkers.appendChild(marker);
      
        marker.addEventListener('click', () => {
          const element = document.getElementById(section.id);
          if (element) {
            // Define the offset (height of your top banner)
            const offset = -610; // Adjust this value as needed for your top banner
            const elementPosition = element.offsetTop;
      
            // Scroll to the position considering the offset
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth',
            });
          }
        });
      }
      
  
    updateProgress() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      this.progressBar.style.height = `${progress}%`;
  
      // Update active section based on scroll position
      const scrollPosition = window.pageYOffset + window.innerHeight / 3;
      const markers = document.querySelectorAll('.section-marker');
  
      this.sectionsList.forEach((section, index) => {
        const element = document.getElementById(section.id);
        const marker = markers[index];
        if (element && scrollPosition >= element.offsetTop) {
          marker.classList.add('active');
        } else {
          marker.classList.remove('active');
        }
      });
    }
  
    updateMarkerPositions() {
      const markers = this.sectionMarkers.querySelectorAll('.section-marker');
      markers.forEach((marker, index) => {
        this.updateMarkerPosition(marker, this.sectionsList[index]);
      });
    }
  
    updateMarkerPosition(marker, section) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const sectionElement = document.getElementById(section.id);
      const sectionPosition = sectionElement ? sectionElement.offsetTop : 0;
      marker.style.top = `${(sectionPosition / totalHeight) * 100}%`;
    }
  }
  
  // Initialize progress bar when document is ready
  document.addEventListener('DOMContentLoaded', () => {
    new ProgressBar();
  });
  