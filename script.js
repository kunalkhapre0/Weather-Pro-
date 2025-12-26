// Enhanced Weather App with Animations and Multiple Features
class WeatherApp {
    constructor() {
        this.apiKey = '36a0d185fc824644a9e135856252512';
        this.currentTheme = 'default';
        this.currentLanguage = 'en';
        this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
        this.voiceRecognition = null;
        this.forecastDays = 7;
        this.temperatureUnit = localStorage.getItem('temperatureUnit') || 'celsius';
        this.animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
        this.currentWeatherData = null;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeTime();
        this.initializeTabs();
        this.initializeThemes();
        this.initializeVoiceRecognition();
        this.initializeWeatherAnimations();
        this.initializeTitleBar();
        this.initializeMenu();
        this.loadFavorites();
        this.loadSettings();
    }

    initializeTitleBar() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            this.toggleMenu();
        });

        // Quick search
        document.getElementById('quickSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.quickSearch();
            }
        });

        // Title bar buttons
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshWeather();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('notificationsBtn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    initializeMenu() {
        // Menu close
        document.getElementById('menuClose').addEventListener('click', () => {
            this.closeMenu();
        });

        // Menu overlay
        document.getElementById('menuOverlay').addEventListener('click', () => {
            this.closeMenu();
        });

        // Update menu indicators
        this.updateMenuIndicators();
    }

    toggleMenu() {
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
        const toggle = document.getElementById('menuToggle');
        
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        toggle.classList.toggle('active');
    }

    closeMenu() {
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
        const toggle = document.getElementById('menuToggle');
        
        menu.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
    }

    quickSearch() {
        const query = document.getElementById('quickSearchInput').value;
        if (query) {
            document.getElementById('cityInput').value = query;
            this.getWeather();
            document.getElementById('quickSearchInput').value = '';
        }
    }

    refreshWeather() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.classList.add('spinning');
        
        if (this.currentWeatherData) {
            const city = this.currentWeatherData.location.name;
            document.getElementById('cityInput').value = city;
            this.getWeather().finally(() => {
                refreshBtn.classList.remove('spinning');
            });
        } else {
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
            }, 1000);
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    showNotifications() {
        // Create notifications panel
        const modal = document.createElement('div');
        modal.className = 'notifications-modal';
        modal.innerHTML = `
            <div class="notifications-content">
                <div class="notifications-header">
                    <h3>Weather Notifications</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="notifications-body">
                    <div class="notification-item">
                        <i class="fas fa-exclamation-triangle text-warning"></i>
                        <div class="notification-content">
                            <div class="notification-title">Weather Alert</div>
                            <div class="notification-text">Heavy rain expected in your area</div>
                            <div class="notification-time">2 hours ago</div>
                        </div>
                    </div>
                    <div class="notification-item">
                        <i class="fas fa-sun text-success"></i>
                        <div class="notification-content">
                            <div class="notification-title">Weather Update</div>
                            <div class="notification-text">Clear skies for the weekend</div>
                            <div class="notification-time">5 hours ago</div>
                        </div>
                    </div>
                    <div class="notification-item">
                        <i class="fas fa-snowflake text-info"></i>
                        <div class="notification-content">
                            <div class="notification-title">Temperature Drop</div>
                            <div class="notification-text">Temperature dropping below 0°C tonight</div>
                            <div class="notification-time">1 day ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        setTimeout(() => modal.classList.add('show'), 10);
    }

    showSettings() {
        // Create settings panel
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h3>Settings</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="settings-body">
                    <div class="setting-group">
                        <h4>Temperature Units</h4>
                        <div class="setting-options">
                            <label class="setting-option">
                                <input type="radio" name="tempUnit" value="celsius" ${this.temperatureUnit === 'celsius' ? 'checked' : ''}>
                                <span>Celsius (°C)</span>
                            </label>
                            <label class="setting-option">
                                <input type="radio" name="tempUnit" value="fahrenheit" ${this.temperatureUnit === 'fahrenheit' ? 'checked' : ''}>
                                <span>Fahrenheit (°F)</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>Weather Animations</h4>
                        <div class="setting-toggle">
                            <label class="toggle-switch">
                                <input type="checkbox" ${this.animationsEnabled ? 'checked' : ''} onchange="weatherApp.toggleAnimations()">
                                <span class="toggle-slider"></span>
                            </label>
                            <span>Enable weather animations</span>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>Notifications</h4>
                        <div class="setting-toggle">
                            <label class="toggle-switch">
                                <input type="checkbox" ${this.notificationsEnabled ? 'checked' : ''} onchange="weatherApp.toggleNotifications()">
                                <span class="toggle-slider"></span>
                            </label>
                            <span>Enable weather notifications</span>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>Default Forecast</h4>
                        <div class="setting-options">
                            <label class="setting-option">
                                <input type="radio" name="defaultForecast" value="7" ${this.forecastDays === 7 ? 'checked' : ''}>
                                <span>7 Days</span>
                            </label>
                            <label class="setting-option">
                                <input type="radio" name="defaultForecast" value="14" ${this.forecastDays === 14 ? 'checked' : ''}>
                                <span>14 Days</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-footer">
                    <button class="btn-primary" onclick="weatherApp.saveSettings()">Save Settings</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        setTimeout(() => modal.classList.add('show'), 10);
    }

    saveSettings() {
        const tempUnit = document.querySelector('input[name="tempUnit"]:checked')?.value || 'celsius';
        const defaultForecast = parseInt(document.querySelector('input[name="defaultForecast"]:checked')?.value) || 7;
        
        this.temperatureUnit = tempUnit;
        this.forecastDays = defaultForecast;
        
        localStorage.setItem('temperatureUnit', tempUnit);
        localStorage.setItem('animationsEnabled', this.animationsEnabled);
        localStorage.setItem('notificationsEnabled', this.notificationsEnabled);
        localStorage.setItem('defaultForecastDays', defaultForecast);
        
        this.updateMenuIndicators();
        
        // Close settings modal
        const modal = document.querySelector('.settings-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
        
        // Refresh weather if data exists
        if (this.currentWeatherData) {
            this.refreshWeather();
        }
    }

    loadSettings() {
        this.temperatureUnit = localStorage.getItem('temperatureUnit') || 'celsius';
        this.animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
        this.forecastDays = parseInt(localStorage.getItem('defaultForecastDays')) || 7;
        
        this.updateMenuIndicators();
    }

    updateMenuIndicators() {
        document.getElementById('unitsIndicator').textContent = this.temperatureUnit === 'celsius' ? '°C' : '°F';
        document.getElementById('animationsIndicator').textContent = this.animationsEnabled ? 'ON' : 'OFF';
        document.getElementById('notificationsIndicator').textContent = this.notificationsEnabled ? 'ON' : 'OFF';
    }

    toggleUnits() {
        this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        localStorage.setItem('temperatureUnit', this.temperatureUnit);
        this.updateMenuIndicators();
        
        if (this.currentWeatherData) {
            this.refreshWeather();
        }
    }

    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        localStorage.setItem('animationsEnabled', this.animationsEnabled);
        this.updateMenuIndicators();
        
        if (!this.animationsEnabled) {
            document.body.classList.add('animations-disabled');
        } else {
            document.body.classList.remove('animations-disabled');
        }
    }

    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        localStorage.setItem('notificationsEnabled', this.notificationsEnabled);
        this.updateMenuIndicators();
    }

    setForecastDays(days) {
        this.forecastDays = days;
        
        // Update active button
        document.querySelectorAll('.forecast-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-days="${days}"]`).classList.add('active');
        
        // Refresh forecast if weather data exists
        if (this.currentWeatherData) {
            this.getForecastData(this.currentWeatherData.location.name, days);
        }
        
        this.closeMenu();
    }

    showHourlyForecast() {
        // Update active button
        document.querySelectorAll('.forecast-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-days="hourly"]').classList.add('active');
        
        if (this.currentWeatherData) {
            this.displayHourlyForecast(this.currentWeatherData.location.name);
        }
        
        this.closeMenu();
    }

    async getForecastData(city, days) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`);
            
            if (!response.ok) {
                throw new Error('Unable to fetch forecast data');
            }

            const forecastData = await response.json();
            this.displayForecastData(forecastData);
            
        } catch (error) {
            console.error('Forecast error:', error);
        }
    }

    async displayHourlyForecast(city) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=3&aqi=no&alerts=no`);
            
            if (!response.ok) {
                throw new Error('Unable to fetch hourly data');
            }

            const data = await response.json();
            const forecastContainer = document.getElementById('forecastData');
            
            // Get next 24 hours
            const now = new Date();
            const hourlyData = [];
            
            data.forecast.forecastday.forEach(day => {
                day.hour.forEach(hour => {
                    const hourTime = new Date(hour.time);
                    if (hourTime > now && hourlyData.length < 24) {
                        hourlyData.push(hour);
                    }
                });
            });
            
            forecastContainer.innerHTML = hourlyData.map((hour, index) => {
                const time = new Date(hour.time);
                const timeStr = time.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    hour12: true 
                });
                
                let iconUrl = hour.condition.icon;
                if (iconUrl.startsWith('//')) {
                    iconUrl = 'https:' + iconUrl;
                }
                
                const temp = this.temperatureUnit === 'celsius' ? 
                    Math.round(hour.temp_c) : Math.round(hour.temp_f);
                const unit = this.temperatureUnit === 'celsius' ? '°C' : '°F';
                
                return `
                    <div class="hourly-forecast-card" data-hour="${index}">
                        <div class="hourly-time">${timeStr}</div>
                        <img src="${iconUrl}" alt="${hour.condition.text}" class="hourly-icon">
                        <div class="hourly-temp">${temp}${unit}</div>
                        <div class="hourly-condition">${hour.condition.text}</div>
                        <div class="hourly-details">
                            <div class="hourly-detail">
                                <i class="fas fa-tint"></i>
                                <span>${hour.chance_of_rain}%</span>
                            </div>
                            <div class="hourly-detail">
                                <i class="fas fa-wind"></i>
                                <span>${Math.round(hour.wind_kph)} km/h</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Hourly forecast error:', error);
        }
    }

    showFavorites() {
        document.querySelector('.tab-btn[data-tab="favorites"]').click();
        this.closeMenu();
    }

    showWeatherAlerts() {
        this.showNotifications();
        this.closeMenu();
    }

    changeThemeFromMenu(themeName) {
        const themes = {
            default: {
                name: 'Default',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            dark: {
                name: 'Dark',
                gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            },
            ocean: {
                name: 'Ocean',
                gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)'
            },
            sunset: {
                name: 'Sunset',
                gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
            },
            forest: {
                name: 'Forest',
                gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
            },
            neon: {
                name: 'Neon',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        };
        
        this.changeTheme(themeName, themes);
        
        // Update active theme in menu
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
        
        this.closeMenu();
    }

    showAbout() {
        const modal = document.createElement('div');
        modal.className = 'about-modal';
        modal.innerHTML = `
            <div class="about-content">
                <div class="about-header">
                    <h3>About Weather Pro</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="about-body">
                    <div class="about-logo">
                        <i class="fas fa-cloud-sun"></i>
                    </div>
                    <h4>Weather Pro v2.0</h4>
                    <p>Advanced weather application with beautiful animations and comprehensive forecasting.</p>
                    
                    <div class="about-features">
                        <h5>Features:</h5>
                        <ul>
                            <li>Real-time weather data</li>
                            <li>7-day and 14-day forecasts</li>
                            <li>Hourly weather predictions</li>
                            <li>Beautiful weather animations</li>
                            <li>Multiple themes</li>
                            <li>Voice search</li>
                            <li>Favorite locations</li>
                            <li>Weather alerts</li>
                        </ul>
                    </div>
                    
                    <div class="about-credits">
                        <p>Weather data provided by WeatherAPI.com</p>
                        <p>© 2024 Weather Pro. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        setTimeout(() => modal.classList.add('show'), 10);
        this.closeMenu();
    }

    showHelp() {
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>Help & Support</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <h4>Getting Started</h4>
                        <p>Enter a city name in the search box or use your current location to get weather information.</p>
                    </div>
                    
                    <div class="help-section">
                        <h4>Features</h4>
                        <ul>
                            <li><strong>Voice Search:</strong> Click the microphone icon to search by voice</li>
                            <li><strong>Themes:</strong> Choose from 6 beautiful themes in the menu</li>
                            <li><strong>Forecasts:</strong> Switch between 7-day, 14-day, and hourly forecasts</li>
                            <li><strong>Favorites:</strong> Save your favorite cities for quick access</li>
                            <li><strong>Animations:</strong> Enjoy weather-based background animations</li>
                        </ul>
                    </div>
                    
                    <div class="help-section">
                        <h4>Keyboard Shortcuts</h4>
                        <ul>
                            <li><strong>Enter:</strong> Search for weather</li>
                            <li><strong>F11:</strong> Toggle fullscreen</li>
                            <li><strong>Ctrl + R:</strong> Refresh weather data</li>
                        </ul>
                    </div>
                    
                    <div class="help-section">
                        <h4>Need More Help?</h4>
                        <p>Contact support at: support@weatherpro.com</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        setTimeout(() => modal.classList.add('show'), 10);
        this.closeMenu();
    }

    initializeEventListeners() {
        // Search functionality
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getWeather();
            }
        });

        // Voice search button
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.onclick = () => this.startVoiceSearch();
        document.querySelector('.search-box').appendChild(voiceBtn);
    }

    initializeTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('currentTime').textContent = `${dateString} • ${timeString}`;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and panes
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding pane
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    initializeThemes() {
        const themes = {
            default: {
                name: 'Default',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            dark: {
                name: 'Dark',
                gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            },
            ocean: {
                name: 'Ocean',
                gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)'
            },
            sunset: {
                name: 'Sunset',
                gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
            },
            forest: {
                name: 'Forest',
                gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
            },
            neon: {
                name: 'Neon',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        };

        // Create theme selector
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <select id="themeSelect">
                ${Object.entries(themes).map(([key, theme]) => 
                    `<option value="${key}">${theme.name}</option>`
                ).join('')}
            </select>
        `;
        
        document.querySelector('.app-header').appendChild(themeSelector);

        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.changeTheme(e.target.value, themes);
        });
    }

    changeTheme(themeName, themes) {
        this.currentTheme = themeName;
        const theme = themes[themeName];
        document.body.style.background = theme.gradient;
        
        // Update body class for theme-specific styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        // Update favicon based on theme
        this.updateFavicon(themeName);
        
        localStorage.setItem('weatherTheme', themeName);
    }

    updateFavicon(theme) {
        const faviconColors = {
            default: { sun: '#ffd700', rays: '#ffd700' },
            dark: { sun: '#f39c12', rays: '#f39c12' },
            ocean: { sun: '#3498db', rays: '#3498db' },
            sunset: { sun: '#ff6b6b', rays: '#ff6b6b' },
            forest: { sun: '#2ecc71', rays: '#2ecc71' },
            neon: { sun: '#9b59b6', rays: '#9b59b6' }
        };
        
        const colors = faviconColors[theme] || faviconColors.default;
        
        const faviconSvg = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <defs>
                    <linearGradient id='sunGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' style='stop-color:${colors.sun}'/>
                        <stop offset='100%' style='stop-color:${colors.sun}'/>
                    </linearGradient>
                </defs>
                <circle cx='50' cy='50' r='20' fill='url(#sunGrad)'/>
                <path d='M50 10 L50 25 M90 50 L75 50 M50 90 L50 75 M10 50 L25 50 M79.3 20.7 L68.9 31.1 M79.3 79.3 L68.9 68.9 M20.7 79.3 L31.1 68.9 M20.7 20.7 L31.1 31.1' 
                      stroke='${colors.rays}' stroke-width='3' stroke-linecap='round'/>
            </svg>
        `;
        
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
        }
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = false;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = 'en-US';

            this.voiceRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('cityInput').value = transcript;
                this.getWeather();
            };

            this.voiceRecognition.onerror = (event) => {
                console.log('Voice recognition error:', event.error);
            };
        }
    }

    startVoiceSearch() {
        if (this.voiceRecognition) {
            this.voiceRecognition.start();
            const voiceBtn = document.querySelector('.voice-btn');
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceBtn.style.background = '#e74c3c';
            
            setTimeout(() => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.background = '';
            }, 3000);
        }
    }

    initializeWeatherAnimations() {
        // Initialize all animation containers
        const animationContainers = [
            'sun-container',
            'clouds-container', 
            'rain-container',
            'snow-container',
            'thunder-container',
            'wind-container',
            'fog-container'
        ];

        animationContainers.forEach(container => {
            const element = document.querySelector(`.${container}`);
            if (element) {
                element.classList.remove('active');
            }
        });
    }

    updateBackgroundAnimation(weatherCondition) {
        // Remove all weather state classes
        const weatherStates = [
            'weather-sunny',
            'weather-cloudy', 
            'weather-rainy',
            'weather-snowy',
            'weather-thunderstorm',
            'weather-windy',
            'weather-foggy'
        ];
        
        weatherStates.forEach(state => {
            document.body.classList.remove(state);
        });

        // Remove active class from all animation containers
        const animationContainers = document.querySelectorAll('.animated-bg > div');
        animationContainers.forEach(container => {
            container.classList.remove('active');
        });

        // Determine weather state based on condition
        const condition = weatherCondition.toLowerCase();
        let weatherState = 'weather-sunny'; // default
        let backgroundGradient = 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%)'; // sunny default

        if (condition.includes('sun') || condition.includes('clear')) {
            weatherState = 'weather-sunny';
            backgroundGradient = 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%)';
            document.querySelector('.sun-container').classList.add('active');
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('sunny');
        } else if (condition.includes('cloud') || condition.includes('overcast')) {
            weatherState = 'weather-cloudy';
            backgroundGradient = 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)';
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('cloudy');
        } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
            weatherState = 'weather-rainy';
            backgroundGradient = 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)';
            document.querySelector('.rain-container').classList.add('active');
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('rainy');
        } else if (condition.includes('snow') || condition.includes('blizzard')) {
            weatherState = 'weather-snowy';
            backgroundGradient = 'linear-gradient(135deg, #E6DEDD 0%, #D1C4E9 100%)';
            document.querySelector('.snow-container').classList.add('active');
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('snowy');
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            weatherState = 'weather-thunderstorm';
            backgroundGradient = 'linear-gradient(135deg, #2C3E50 0%, #000000 100%)';
            document.querySelector('.thunder-container').classList.add('active');
            document.querySelector('.rain-container').classList.add('active');
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('thunderstorm');
        } else if (condition.includes('wind')) {
            weatherState = 'weather-windy';
            backgroundGradient = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
            document.querySelector('.wind-container').classList.add('active');
            document.querySelector('.clouds-container').classList.add('active');
            this.updateLogoWeatherState('windy');
        } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
            weatherState = 'weather-foggy';
            backgroundGradient = 'linear-gradient(135deg, #D3D3D3 0%, #A9A9A9 100%)';
            document.querySelector('.fog-container').classList.add('active');
            this.updateLogoWeatherState('foggy');
        }

        // Apply weather state class and background
        document.body.classList.add(weatherState);
        
        // Update background gradient with smooth transition
        if (this.currentTheme === 'default') {
            document.body.style.background = backgroundGradient;
        }
    }

    updateLogoWeatherState(weatherType) {
        // Update favicon to reflect current weather
        this.updateWeatherFavicon(weatherType);
        
        // Add special logo animations based on weather
        const logoIcon = document.querySelector('.logo-weather-icon');
        if (logoIcon) {
            logoIcon.className = `logo-weather-icon logo-${weatherType}`;
        }
    }

    updateWeatherFavicon(weatherType) {
        const weatherIcons = {
            sunny: {
                svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                    <defs>
                        <linearGradient id='sunGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                            <stop offset='0%' style='stop-color:#ffd700'/>
                            <stop offset='100%' style='stop-color:#ff8c00'/>
                        </linearGradient>
                    </defs>
                    <circle cx='50' cy='50' r='20' fill='url(#sunGrad)'/>
                    <path d='M50 10 L50 25 M90 50 L75 50 M50 90 L50 75 M10 50 L25 50 M79.3 20.7 L68.9 31.1 M79.3 79.3 L68.9 68.9 M20.7 79.3 L31.1 68.9 M20.7 20.7 L31.1 31.1' 
                          stroke='#ffd700' stroke-width='3' stroke-linecap='round'/>
                </svg>`
            },
            cloudy: {
                svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                    <ellipse cx='35' cy='60' rx='25' ry='15' fill='#e0e0e0'/>
                    <ellipse cx='55' cy='55' rx='30' ry='18' fill='#d0d0d0'/>
                    <ellipse cx='45' cy='45' rx='20' ry='12' fill='#f0f0f0'/>
                </svg>`
            },
            rainy: {
                svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                    <ellipse cx='50' cy='40' rx='30' ry='18' fill='#808080'/>
                    <path d='M35 55 L35 75 M45 60 L45 80 M55 58 L55 78 M65 55 L65 75' 
                          stroke='#4fc3f7' stroke-width='2' stroke-linecap='round'/>
                </svg>`
            },
            snowy: {
                svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                    <ellipse cx='50' cy='40' rx='30' ry='18' fill='#c0c0c0'/>
                    <text x='35' y='70' font-family='Arial' font-size='12' fill='white'>❄</text>
                    <text x='50' y='75' font-family='Arial' font-size='10' fill='white'>❅</text>
                    <text x='65' y='68' font-family='Arial' font-size='12' fill='white'>❆</text>
                </svg>`
            },
            thunderstorm: {
                svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                    <ellipse cx='50' cy='35' rx='35' ry='20' fill='#404040'/>
                    <path d='M45 50 L55 50 L50 65 L60 65 L45 85 L50 70 L40 70 Z' 
                          fill='#ffff00' stroke='#ffd700' stroke-width='1'/>
                </svg>`
            }
        };
        
        const iconData = weatherIcons[weatherType] || weatherIcons.sunny;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `data:image/svg+xml,${encodeURIComponent(iconData.svg)}`;
        }
    }

    async getWeather() {
        const city = document.getElementById('cityInput').value;
        const resultDiv = document.getElementById('weatherResult');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');

        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        // Reset UI
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        try {
            // Fetch current weather and forecast
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${city}&aqi=yes`),
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=${this.forecastDays}&aqi=no&alerts=no`)
            ]);
            
            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            
            this.currentWeatherData = currentData;
            
            this.displayWeatherData(currentData);
            this.displayForecastData(forecastData);
            this.updateBackgroundAnimation(currentData.current.condition.text);

        } catch (error) {
            loadingDiv.classList.add('hidden');
            this.showError(error.message);
        }
    }

    displayWeatherData(data) {
        // Update main weather info with temperature unit conversion
        const temp = this.temperatureUnit === 'celsius' ? 
            Math.round(data.current.temp_c) : Math.round(data.current.temp_f);
        const feelsLike = this.temperatureUnit === 'celsius' ? 
            Math.round(data.current.feelslike_c) : Math.round(data.current.feelslike_f);
        const unit = this.temperatureUnit === 'celsius' ? '°C' : '°F';
        
        document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('temp').textContent = `${temp}${unit}`;
        document.getElementById('condition').textContent = data.current.condition.text;
        
        // Update detailed info
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;
        document.getElementById('visibility').textContent = `${data.current.vis_km} km`;
        document.getElementById('feelsLike').textContent = `${feelsLike}${unit}`;
        document.getElementById('pressure').textContent = `${data.current.pressure_mb} mb`;
        document.getElementById('uvIndex').textContent = data.current.uv;
        
        // Update weather icon
        let iconUrl = data.current.condition.icon;
        if (iconUrl.startsWith('//')) {
            iconUrl = 'https:' + iconUrl;
        }
        document.getElementById('weatherIcon').src = iconUrl;

        // Show result
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('weatherResult').classList.remove('hidden');
    }

    displayForecastData(data) {
        const forecastContainer = document.getElementById('forecastData');
        const forecastDays = data.forecast.forecastday;
        
        forecastContainer.innerHTML = forecastDays.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Today' : 
                          index === 1 ? 'Tomorrow' : 
                          date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const monthDay = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });

            // Get weather icon
            let iconUrl = day.day.condition.icon;
            if (iconUrl.startsWith('//')) {
                iconUrl = 'https:' + iconUrl;
            }

            // Temperature conversion
            const maxTemp = this.temperatureUnit === 'celsius' ? 
                Math.round(day.day.maxtemp_c) : Math.round(day.day.maxtemp_f);
            const minTemp = this.temperatureUnit === 'celsius' ? 
                Math.round(day.day.mintemp_c) : Math.round(day.day.mintemp_f);
            const unit = this.temperatureUnit === 'celsius' ? '°' : '°';

            // Determine weather condition for styling
            const condition = day.day.condition.text.toLowerCase();
            let conditionClass = 'forecast-sunny';
            if (condition.includes('rain') || condition.includes('drizzle')) {
                conditionClass = 'forecast-rainy';
            } else if (condition.includes('cloud') || condition.includes('overcast')) {
                conditionClass = 'forecast-cloudy';
            } else if (condition.includes('snow')) {
                conditionClass = 'forecast-snowy';
            } else if (condition.includes('thunder') || condition.includes('storm')) {
                conditionClass = 'forecast-stormy';
            }

            return `
                <div class="forecast-card ${conditionClass}" data-day="${index}">
                    <div class="forecast-header">
                        <div class="forecast-day">${dayName}</div>
                        <div class="forecast-date">${monthDay}</div>
                    </div>
                    
                    <div class="forecast-icon-container">
                        <img src="${iconUrl}" alt="${day.day.condition.text}" class="forecast-icon">
                        <div class="forecast-icon-glow"></div>
                    </div>
                    
                    <div class="forecast-condition">${day.day.condition.text}</div>
                    
                    <div class="forecast-temps">
                        <span class="forecast-high">${maxTemp}${unit}</span>
                        <span class="forecast-low">${minTemp}${unit}</span>
                    </div>
                    
                    <div class="forecast-details">
                        <div class="forecast-detail">
                            <i class="fas fa-tint"></i>
                            <span>${day.day.avghumidity}%</span>
                        </div>
                        <div class="forecast-detail">
                            <i class="fas fa-wind"></i>
                            <span>${Math.round(day.day.maxwind_kph)} km/h</span>
                        </div>
                        <div class="forecast-detail">
                            <i class="fas fa-cloud-rain"></i>
                            <span>${day.day.daily_chance_of_rain}%</span>
                        </div>
                    </div>
                    
                    <div class="forecast-extras">
                        <div class="forecast-extra">
                            <i class="fas fa-sun"></i>
                            <span>UV ${day.day.uv}</span>
                        </div>
                        <div class="forecast-extra">
                            <i class="fas fa-eye"></i>
                            <span>${day.day.avgvis_km} km</span>
                        </div>
                    </div>
                    
                    <div class="forecast-hourly-preview">
                        <div class="hourly-temps">
                            ${this.generateHourlyPreview(day.hour)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for detailed view
        this.addForecastClickHandlers(forecastDays);
    }

    generateHourlyPreview(hourlyData) {
        // Show 4 key times: 6AM, 12PM, 6PM, 12AM
        const keyHours = [6, 12, 18, 0];
        
        return keyHours.map(hour => {
            const hourData = hourlyData.find(h => new Date(h.time).getHours() === hour);
            if (!hourData) return '';
            
            const time = hour === 0 ? '12AM' : 
                        hour === 12 ? '12PM' : 
                        hour < 12 ? `${hour}AM` : `${hour - 12}PM`;
            
            const temp = this.temperatureUnit === 'celsius' ? 
                Math.round(hourData.temp_c) : Math.round(hourData.temp_f);
            const unit = this.temperatureUnit === 'celsius' ? '°' : '°';
            
            return `
                <div class="hourly-temp">
                    <div class="hourly-time">${time}</div>
                    <div class="hourly-value">${temp}${unit}</div>
                </div>
            `;
        }).join('');
    }

    addForecastClickHandlers(forecastDays) {
        const forecastCards = document.querySelectorAll('.forecast-card');
        
        forecastCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showDetailedForecast(forecastDays[index], index);
            });
        });
    }

    showDetailedForecast(dayData, dayIndex) {
        const modal = document.createElement('div');
        modal.className = 'forecast-modal';
        modal.innerHTML = `
            <div class="forecast-modal-content">
                <div class="forecast-modal-header">
                    <h3>${dayIndex === 0 ? 'Today' : dayIndex === 1 ? 'Tomorrow' : new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    <button class="forecast-modal-close">&times;</button>
                </div>
                
                <div class="forecast-modal-body">
                    <div class="detailed-overview">
                        <img src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}" class="detailed-icon">
                        <div class="detailed-info">
                            <div class="detailed-condition">${dayData.day.condition.text}</div>
                            <div class="detailed-temps">
                                <span class="detailed-high">${Math.round(dayData.day.maxtemp_c)}°C</span>
                                <span class="detailed-separator">/</span>
                                <span class="detailed-low">${Math.round(dayData.day.mintemp_c)}°C</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-stats">
                        <div class="detailed-stat">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Feels like ${Math.round(dayData.day.avgtemp_c)}°C</span>
                        </div>
                        <div class="detailed-stat">
                            <i class="fas fa-tint"></i>
                            <span>Humidity ${dayData.day.avghumidity}%</span>
                        </div>
                        <div class="detailed-stat">
                            <i class="fas fa-wind"></i>
                            <span>Wind ${Math.round(dayData.day.maxwind_kph)} km/h</span>
                        </div>
                        <div class="detailed-stat">
                            <i class="fas fa-cloud-rain"></i>
                            <span>Rain chance ${dayData.day.daily_chance_of_rain}%</span>
                        </div>
                        <div class="detailed-stat">
                            <i class="fas fa-sun"></i>
                            <span>UV Index ${dayData.day.uv}</span>
                        </div>
                        <div class="detailed-stat">
                            <i class="fas fa-eye"></i>
                            <span>Visibility ${dayData.day.avgvis_km} km</span>
                        </div>
                    </div>
                    
                    <div class="hourly-forecast">
                        <h4>Hourly Forecast</h4>
                        <div class="hourly-scroll">
                            ${this.generateDetailedHourly(dayData.hour)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.forecast-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
    }

    generateDetailedHourly(hourlyData) {
        return hourlyData.map(hour => {
            const time = new Date(hour.time);
            const timeStr = time.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            });
            
            let iconUrl = hour.condition.icon;
            if (iconUrl.startsWith('//')) {
                iconUrl = 'https:' + iconUrl;
            }
            
            return `
                <div class="hourly-item">
                    <div class="hourly-item-time">${timeStr}</div>
                    <img src="${iconUrl}" alt="${hour.condition.text}" class="hourly-item-icon">
                    <div class="hourly-item-temp">${Math.round(hour.temp_c)}°</div>
                    <div class="hourly-item-rain">
                        <i class="fas fa-tint"></i>
                        ${hour.chance_of_rain}%
                    </div>
                    <div class="hourly-item-wind">
                        <i class="fas fa-wind"></i>
                        ${Math.round(hour.wind_kph)}
                    </div>
                </div>
            `;
        }).join('');
    }

    displayWeatherData(data) {
        // Update main weather info
        document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('temp').textContent = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById('condition').textContent = data.current.condition.text;
        
        // Update detailed info
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;
        document.getElementById('visibility').textContent = `${data.current.vis_km} km`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.current.feelslike_c)}°C`;
        document.getElementById('pressure').textContent = `${data.current.pressure_mb} mb`;
        document.getElementById('uvIndex').textContent = data.current.uv;
        
        // Update weather icon
        let iconUrl = data.current.condition.icon;
        if (iconUrl.startsWith('//')) {
            iconUrl = 'https:' + iconUrl;
        }
        document.getElementById('weatherIcon').src = iconUrl;

        // Show result
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('weatherResult').classList.remove('hidden');
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.querySelector('.error-text').textContent = message;
        errorDiv.classList.remove('hidden');
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.getWeatherByCoords(lat, lon);
                },
                (error) => {
                    // Silently fail - don't show location access errors
                    console.log('Location access declined or unavailable');
                    this.showPopularCities();
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        } else {
            this.showPopularCities();
        }
    }

    showPopularCities() {
        const cities = [
            'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
            'Mumbai', 'Dubai', 'Singapore', 'Toronto', 'Berlin'
        ];
        
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        document.getElementById('cityInput').value = randomCity;
        this.getWeather();
    }

    async getWeatherByCoords(lat, lon) {
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');

        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        try {
            // Fetch current weather and forecast
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}&aqi=yes`),
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=${this.forecastDays}&aqi=no&alerts=no`)
            ]);
            
            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('Unable to fetch weather data');
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            
            this.currentWeatherData = currentData;
            
            this.displayWeatherData(currentData);
            this.displayForecastData(forecastData);
            this.updateBackgroundAnimation(currentData.current.condition.text);

        } catch (error) {
            loadingDiv.classList.add('hidden');
            this.showError(error.message);
        }
    }

    loadFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        
        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="no-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <p>No favorite cities yet</p>
                    <small>Search for a city and add it to favorites!</small>
                </div>
            `;
        } else {
            favoritesList.innerHTML = this.favorites.map((favorite, index) => `
                <div class="favorite-item" data-index="${index}">
                    <div class="favorite-main">
                        <div class="favorite-info">
                            <div class="favorite-city">${favorite.name}</div>
                            <div class="favorite-country">${favorite.country}</div>
                            <div class="favorite-coords">${favorite.lat}°, ${favorite.lon}°</div>
                        </div>
                        <div class="favorite-weather" id="favorite-weather-${index}">
                            <div class="favorite-temp">--°</div>
                            <div class="favorite-condition">Loading...</div>
                        </div>
                    </div>
                    <div class="favorite-actions">
                        <button class="favorite-action-btn" onclick="weatherApp.loadFavoriteCity('${favorite.name}')" title="View Weather">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="favorite-action-btn" onclick="weatherApp.editFavorite(${index})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="favorite-action-btn danger" onclick="weatherApp.removeFavorite(${index})" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Load weather for each favorite
            this.loadFavoritesWeather();
        }
        
        // Initialize search functionality
        this.initializeFavoritesSearch();
    }

    async loadFavoritesWeather() {
        for (let i = 0; i < this.favorites.length; i++) {
            const favorite = this.favorites[i];
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${favorite.lat},${favorite.lon}&aqi=no`);
                
                if (response.ok) {
                    const data = await response.json();
                    const weatherElement = document.getElementById(`favorite-weather-${i}`);
                    
                    if (weatherElement) {
                        const temp = this.temperatureUnit === 'celsius' ? 
                            Math.round(data.current.temp_c) : Math.round(data.current.temp_f);
                        const unit = this.temperatureUnit === 'celsius' ? '°C' : '°F';
                        
                        weatherElement.innerHTML = `
                            <div class="favorite-temp">${temp}${unit}</div>
                            <div class="favorite-condition">${data.current.condition.text}</div>
                            <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" class="favorite-icon">
                        `;
                    }
                }
            } catch (error) {
                console.error(`Error loading weather for ${favorite.name}:`, error);
                const weatherElement = document.getElementById(`favorite-weather-${i}`);
                if (weatherElement) {
                    weatherElement.innerHTML = `
                        <div class="favorite-temp">--°</div>
                        <div class="favorite-condition">Error</div>
                    `;
                }
            }
        }
    }

    initializeFavoritesSearch() {
        const searchInput = document.getElementById('favoritesSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterFavorites(e.target.value);
            });
        }
    }

    filterFavorites(searchTerm) {
        const favoriteItems = document.querySelectorAll('.favorite-item');
        const term = searchTerm.toLowerCase();
        
        favoriteItems.forEach(item => {
            const cityName = item.querySelector('.favorite-city').textContent.toLowerCase();
            const countryName = item.querySelector('.favorite-country').textContent.toLowerCase();
            
            if (cityName.includes(term) || countryName.includes(term)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    async addToFavorites(cityName) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${cityName}&aqi=no`);
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            const newFavorite = {
                name: data.location.name,
                country: data.location.country,
                region: data.location.region,
                lat: data.location.lat,
                lon: data.location.lon,
                addedDate: new Date().toISOString()
            };
            
            // Check if city already exists
            const exists = this.favorites.some(fav => 
                fav.name.toLowerCase() === newFavorite.name.toLowerCase() && 
                fav.country.toLowerCase() === newFavorite.country.toLowerCase()
            );
            
            if (exists) {
                this.showError('City already in favorites');
                return false;
            }
            
            this.favorites.push(newFavorite);
            localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
            this.loadFavorites();
            
            // Show success message
            this.showSuccessMessage(`${newFavorite.name} added to favorites!`);
            return true;
            
        } catch (error) {
            this.showError('Unable to add city to favorites');
            return false;
        }
    }

    removeFavorite(index) {
        const favorite = this.favorites[index];
        
        // Show confirmation dialog
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <h3>Remove Favorite</h3>
                </div>
                <div class="confirmation-body">
                    <p>Are you sure you want to remove <strong>${favorite.name}, ${favorite.country}</strong> from your favorites?</p>
                </div>
                <div class="confirmation-actions">
                    <button class="btn-secondary" onclick="this.closest('.confirmation-modal').remove()">Cancel</button>
                    <button class="btn-danger" onclick="weatherApp.confirmRemoveFavorite(${index}); this.closest('.confirmation-modal').remove()">Remove</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    confirmRemoveFavorite(index) {
        const removedFavorite = this.favorites[index];
        this.favorites.splice(index, 1);
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        this.loadFavorites();
        
        this.showSuccessMessage(`${removedFavorite.name} removed from favorites`);
    }

    editFavorite(index) {
        const favorite = this.favorites[index];
        
        const modal = document.createElement('div');
        modal.className = 'edit-favorite-modal';
        modal.innerHTML = `
            <div class="edit-favorite-content">
                <div class="edit-favorite-header">
                    <h3>Edit Favorite</h3>
                    <button class="modal-close" onclick="this.closest('.edit-favorite-modal').remove()">&times;</button>
                </div>
                <div class="edit-favorite-body">
                    <div class="form-group">
                        <label>City Name</label>
                        <input type="text" id="editCityName" value="${favorite.name}">
                    </div>
                    <div class="form-group">
                        <label>Country</label>
                        <input type="text" id="editCountry" value="${favorite.country}">
                    </div>
                    <div class="form-group">
                        <label>Region</label>
                        <input type="text" id="editRegion" value="${favorite.region || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Latitude</label>
                            <input type="number" id="editLat" value="${favorite.lat}" step="0.000001">
                        </div>
                        <div class="form-group">
                            <label>Longitude</label>
                            <input type="number" id="editLon" value="${favorite.lon}" step="0.000001">
                        </div>
                    </div>
                </div>
                <div class="edit-favorite-actions">
                    <button class="btn-secondary" onclick="this.closest('.edit-favorite-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="weatherApp.saveEditedFavorite(${index})">Save Changes</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    saveEditedFavorite(index) {
        const name = document.getElementById('editCityName').value.trim();
        const country = document.getElementById('editCountry').value.trim();
        const region = document.getElementById('editRegion').value.trim();
        const lat = parseFloat(document.getElementById('editLat').value);
        const lon = parseFloat(document.getElementById('editLon').value);
        
        if (!name || !country || isNaN(lat) || isNaN(lon)) {
            this.showError('Please fill in all required fields');
            return;
        }
        
        this.favorites[index] = {
            ...this.favorites[index],
            name,
            country,
            region,
            lat,
            lon
        };
        
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        this.loadFavorites();
        
        // Close modal
        document.querySelector('.edit-favorite-modal').remove();
        
        this.showSuccessMessage('Favorite updated successfully!');
    }

    showAddFavoriteModal() {
        const modal = document.createElement('div');
        modal.className = 'add-favorite-modal';
        modal.innerHTML = `
            <div class="add-favorite-content">
                <div class="add-favorite-header">
                    <h3>Add Favorite City</h3>
                    <button class="modal-close" onclick="this.closest('.add-favorite-modal').remove()">&times;</button>
                </div>
                <div class="add-favorite-body">
                    <div class="form-group">
                        <label>Search for a city</label>
                        <div class="city-search-container">
                            <input type="text" id="addFavoriteSearch" placeholder="Enter city name...">
                            <button class="search-btn" onclick="weatherApp.searchCityForFavorite()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div id="citySearchResults" class="city-search-results"></div>
                    
                    <div class="popular-cities">
                        <h4>Popular Cities</h4>
                        <div class="popular-cities-grid">
                            ${this.getPopularCities().map(city => `
                                <button class="popular-city-btn" onclick="weatherApp.addPopularCityToFavorites('${city}')">
                                    ${city}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add enter key listener
        document.getElementById('addFavoriteSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCityForFavorite();
            }
        });
        
        setTimeout(() => modal.classList.add('show'), 10);
    }

    getPopularCities() {
        return [
            'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
            'Mumbai', 'Dubai', 'Singapore', 'Toronto', 'Berlin',
            'Los Angeles', 'Madrid', 'Rome', 'Amsterdam', 'Bangkok'
        ];
    }

    async searchCityForFavorite() {
        const searchTerm = document.getElementById('addFavoriteSearch').value.trim();
        const resultsContainer = document.getElementById('citySearchResults');
        
        if (!searchTerm) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
        
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${this.apiKey}&q=${searchTerm}`);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const cities = await response.json();
            
            if (cities.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">No cities found</div>';
                return;
            }
            
            resultsContainer.innerHTML = cities.slice(0, 5).map(city => `
                <div class="city-result" onclick="weatherApp.selectCityForFavorite('${city.name}', '${city.country}', ${city.lat}, ${city.lon})">
                    <div class="city-result-name">${city.name}</div>
                    <div class="city-result-details">${city.region}, ${city.country}</div>
                    <div class="city-result-coords">${city.lat}°, ${city.lon}°</div>
                </div>
            `).join('');
            
        } catch (error) {
            resultsContainer.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        }
    }

    async selectCityForFavorite(name, country, lat, lon) {
        const newFavorite = {
            name,
            country,
            region: '',
            lat,
            lon,
            addedDate: new Date().toISOString()
        };
        
        // Check if city already exists
        const exists = this.favorites.some(fav => 
            fav.name.toLowerCase() === name.toLowerCase() && 
            fav.country.toLowerCase() === country.toLowerCase()
        );
        
        if (exists) {
            this.showError('City already in favorites');
            return;
        }
        
        this.favorites.push(newFavorite);
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        
        // Close modal
        document.querySelector('.add-favorite-modal').remove();
        
        // Refresh favorites list
        this.loadFavorites();
        
        this.showSuccessMessage(`${name} added to favorites!`);
    }

    async addPopularCityToFavorites(cityName) {
        const success = await this.addToFavorites(cityName);
        if (success) {
            document.querySelector('.add-favorite-modal').remove();
        }
    }

    exportFavorites() {
        if (this.favorites.length === 0) {
            this.showError('No favorites to export');
            return;
        }
        
        const dataStr = JSON.stringify(this.favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `weather-favorites-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showSuccessMessage('Favorites exported successfully!');
    }

    importFavorites() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedFavorites = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedFavorites)) {
                        throw new Error('Invalid file format');
                    }
                    
                    // Validate structure
                    const validFavorites = importedFavorites.filter(fav => 
                        fav.name && fav.country && typeof fav.lat === 'number' && typeof fav.lon === 'number'
                    );
                    
                    if (validFavorites.length === 0) {
                        throw new Error('No valid favorites found in file');
                    }
                    
                    // Merge with existing favorites (avoid duplicates)
                    let addedCount = 0;
                    validFavorites.forEach(newFav => {
                        const exists = this.favorites.some(fav => 
                            fav.name.toLowerCase() === newFav.name.toLowerCase() && 
                            fav.country.toLowerCase() === newFav.country.toLowerCase()
                        );
                        
                        if (!exists) {
                            this.favorites.push({
                                ...newFav,
                                addedDate: new Date().toISOString()
                            });
                            addedCount++;
                        }
                    });
                    
                    localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
                    this.loadFavorites();
                    
                    this.showSuccessMessage(`${addedCount} favorites imported successfully!`);
                    
                } catch (error) {
                    this.showError('Failed to import favorites: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    clearAllFavorites() {
        if (this.favorites.length === 0) {
            this.showError('No favorites to clear');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <h3>Clear All Favorites</h3>
                </div>
                <div class="confirmation-body">
                    <p>Are you sure you want to remove all <strong>${this.favorites.length}</strong> favorite cities?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                </div>
                <div class="confirmation-actions">
                    <button class="btn-secondary" onclick="this.closest('.confirmation-modal').remove()">Cancel</button>
                    <button class="btn-danger" onclick="weatherApp.confirmClearAllFavorites(); this.closest('.confirmation-modal').remove()">Clear All</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    confirmClearAllFavorites() {
        this.favorites = [];
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        this.loadFavorites();
        
        this.showSuccessMessage('All favorites cleared');
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    addCurrentCityToFavorites() {
        if (!this.currentWeatherData) {
            this.showError('No weather data available');
            return;
        }
        
        const location = this.currentWeatherData.location;
        const newFavorite = {
            name: location.name,
            country: location.country,
            region: location.region,
            lat: location.lat,
            lon: location.lon,
            addedDate: new Date().toISOString()
        };
        
        // Check if city already exists
        const exists = this.favorites.some(fav => 
            fav.name.toLowerCase() === newFavorite.name.toLowerCase() && 
            fav.country.toLowerCase() === newFavorite.country.toLowerCase()
        );
        
        if (exists) {
            this.showError('City already in favorites');
            return;
        }
        
        this.favorites.push(newFavorite);
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        
        // Update button state
        const btn = document.getElementById('addToFavoritesBtn');
        btn.innerHTML = '<i class="fas fa-check"></i> Added to Favorites';
        btn.disabled = true;
        btn.classList.add('added');
        
        this.showSuccessMessage(`${newFavorite.name} added to favorites!`);
    }

    shareWeather() {
        if (!this.currentWeatherData) {
            this.showError('No weather data available');
            return;
        }
        
        const location = this.currentWeatherData.location;
        const current = this.currentWeatherData.current;
        const temp = this.temperatureUnit === 'celsius' ? 
            Math.round(current.temp_c) : Math.round(current.temp_f);
        const unit = this.temperatureUnit === 'celsius' ? '°C' : '°F';
        
        const shareText = `Weather in ${location.name}, ${location.country}: ${temp}${unit}, ${current.condition.text}. Humidity: ${current.humidity}%, Wind: ${current.wind_kph} km/h`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Weather Update',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showSuccessMessage('Weather info copied to clipboard!');
            }).catch(() => {
                // Show share modal as final fallback
                this.showShareModal(shareText);
            });
        }
    }

    showShareModal(shareText) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-content">
                <div class="share-header">
                    <h3>Share Weather</h3>
                    <button class="modal-close" onclick="this.closest('.share-modal').remove()">&times;</button>
                </div>
                <div class="share-body">
                    <textarea readonly>${shareText}</textarea>
                    <div class="share-actions">
                        <button class="share-btn" onclick="weatherApp.copyToClipboard('${shareText.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i>
                            Copy to Clipboard
                        </button>
                        <button class="share-btn" onclick="weatherApp.shareViaEmail('${shareText.replace(/'/g, "\\'")}')">
                            <i class="fas fa-envelope"></i>
                            Email
                        </button>
                        <button class="share-btn" onclick="weatherApp.shareViaTwitter('${shareText.replace(/'/g, "\\'")}')">
                            <i class="fab fa-twitter"></i>
                            Twitter
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccessMessage('Copied to clipboard!');
            document.querySelector('.share-modal').remove();
        }).catch(() => {
            this.showError('Failed to copy to clipboard');
        });
    }

    shareViaEmail(text) {
        const subject = encodeURIComponent('Weather Update');
        const body = encodeURIComponent(text);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    }

    shareViaTwitter(text) {
        const tweetText = encodeURIComponent(text);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`);
    }

    loadFavoriteCity(city) {
        document.getElementById('cityInput').value = city;
        document.querySelector('.tab-btn[data-tab="current"]').click();
        this.getWeather();
    }
}

// Initialize the weather app
const weatherApp = new WeatherApp();

// Global functions for backward compatibility and menu actions
function getWeather() {
    weatherApp.getWeather();
}

function getCurrentLocation() {
    weatherApp.getCurrentLocation();
}

function quickSearch() {
    weatherApp.quickSearch();
}

function setForecastDays(days) {
    weatherApp.setForecastDays(days);
}

function showHourlyForecast() {
    weatherApp.showHourlyForecast();
}

function showFavorites() {
    weatherApp.showFavorites();
}

function showWeatherAlerts() {
    weatherApp.showWeatherAlerts();
}

function toggleUnits() {
    weatherApp.toggleUnits();
}

function toggleAnimations() {
    weatherApp.toggleAnimations();
}

function toggleNotifications() {
    weatherApp.toggleNotifications();
}

function changeThemeFromMenu(theme) {
    weatherApp.changeThemeFromMenu(theme);
}

function showAbout() {
    weatherApp.showAbout();
}

function showHelp() {
    weatherApp.showHelp();
}

function showAddFavoriteModal() {
    weatherApp.showAddFavoriteModal();
}

function exportFavorites() {
    weatherApp.exportFavorites();
}

function importFavorites() {
    weatherApp.importFavorites();
}

function clearAllFavorites() {
    weatherApp.clearAllFavorites();
}

