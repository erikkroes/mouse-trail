import { LitElement, html, css } from './node_modules/lit-element';

class MouseTrail extends LitElement {
  static get properties() {
    return {
      banner: { type: Boolean },
      drop: { type: Boolean },
      follow: { type: Boolean },
      count: { type: Number },
      spacing: { type: Number},
      speed: {type: Number},
      particles: { type: Array },
    };
  }

  constructor() {
    super();
    this.count = 7;
    this.spacing = 15;
    this.speed = 0.3;

    this.content = this.innerHTML;
    this.mouseX = 0;
    this.mouseY = 0;        
    this.particles = [];
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;          
        }

        .particle {
          position: absolute;
        }

        @media (prefers-reduced-motion: reduce) {
          .particle {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    if (this.banner) {   
      return html`
        ${this.particles.map((particle, i) => {
          return html`<div class="particle" style="top: ${this.particles[i].y}px; left: ${this.particles[i].x}px;">${this.content[i]}</div>`;
        })}    
      `;  
    }
    else {    
      return html`
        ${this.particles.map((particle, i) => {
          return html`<div class="particle" style="
            top: ${this.particles[i].y}px; 
            left: ${this.particles[i].x}px; 
            ${this.particles[i].alpha ? `opacity: ${this.particles[i].alpha};` : ''}">${this.content}</div>`;
        })}
      `;    
      }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.banner) {
      this.count = this.content.length;  
    }
    if (!this.drop) { 
      this.particles = Array.from({ length: this.count }, () => ({ x: 0, y: 0 }));
    }
  }

  firstUpdated(){
    addEventListener('mousemove', this._mouseMoveHandler.bind(this));
    this._startParticles();    
  }

  _mouseMoveHandler(e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY; 

    if (this.drop) {
      this._addParticle(this.mouseX, this.mouseY);        
    }
  }

  _startParticles() {
    if (this.drop) {
      window.setInterval(this._updateParticles.bind(this), 20);
    } else {
      window.setInterval(this._moveParticles.bind(this), 20);
    }
  }

  // banner + follow
  _moveParticles() {
    const offset = this.banner ? this.spacing : 0;
    this.particles.forEach((particle, i) => { 
      let goalX = this.mouseX + offset;
      if (i > 0) {
        goalX = this.particles[i-1].x + offset;
      }

      let goalY = this.mouseY;
      if (i > 0) {
        goalY = this.particles[i-1].y;
      }
     
      this.particles[i].x += (goalX - this.particles[i].x) * this.speed;
      this.particles[i].y += (goalY - this.particles[i].y) * this.speed;
    });
    this.requestUpdate();
  }
  
  // Drop 
  _addParticle(x, y) {
    this.particles.push({ x: x, y: y, alpha: 1 });
  }

  // Drop 
  _updateParticles() {
    this.particles.forEach((particle, i, a) => {
      a[i].y = particle.y + (0.005 * window.innerHeight);
      a[i].alpha = (particle.alpha * 0.99) - 0.01;
      if ( a[i].y <= 0 || a[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    });
    this.requestUpdate();
  }
}

customElements.define('mouse-trail', MouseTrail);