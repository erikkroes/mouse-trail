import { LitElement, html, css } from './node_modules/lit-element';

class MouseTrail extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
      particles: { type: Array },
    };
  }

  constructor() {
    super();
    this.count = 7;
    this.particles = Array(this.count).fill({x : 0, y: 0});
    this.content = this.innerHTML;
    this.mouseX = 0;
    this.mouseY = 0;
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
      `,
    ];
  }

  render() {
    // return html`
    //   ${this.particles.map((particle, i) => this._particleTemplate(particle, i))}
    // `;

    return html`
      ${this.particles.map((particle, i) => {
        return html`<div class="particle" style="top: ${this.particles[i].y}px; left: ${this.particles[i].x}px;">${this.content}</div>`
      })}
    `;    
  }

  firstUpdated(){
    addEventListener('mousemove', this._mouseMoveHandler.bind(this));
    this._startParticles();
  }

  _mouseMoveHandler(e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;           
  }

  _startParticles() {
    // this._moveParticles();
    window.setInterval(this._moveParticles.bind(this), 10);
  }

  _moveParticles() {
    console.log(this.mouseX);
    this.particles.forEach((particle, i) => { 
      let goalX = this.mouseX;
      if (i > 0) {
        goalX = this.particles[i-1].x;
      }

      let goalY = this.mouseY;
      if (i > 0) {
        goalY = this.particles[i-1].y;
      }
     
      this.particles[i].x += (goalX - this.particles[i].x) * 0.9;
      this.particles[i].y += (goalY - this.particles[i].y) * 0.9;


    });
    console.log(this.particles);
    this.requestUpdate();
    // requestAnimationFrame(this._moveParticles;
  }

  _particleTemplate(particle, i) {
    console.log(this);
    return html`<div style="top: ${this.particles[i].x}px; left: ${this.particles[i].y}px;">${this.content}</div>`;
  }
}

customElements.define('mouse-trail', MouseTrail);