
//colors
_white  = 0xFFFAFAFA;
_green  = 0xFF02A924;
_yellow = 0xFFF8F104;
_red    = 0xFFA90202;
_grey   = 0xFF606060;

_bullet = 0xFFFFFF00;
_smoke0 = 0xFF373737;
_smoke1 = 0xFF212121;
_fire   = 0xFFD3E820;
_explosion0 = 0xFFD3E820;
_explosion1 = 0xFFFF6464;

function Vector(x,y){
    this.x = x;
    this.y = y;
}

function Mine(){
    this.z = new Vector(0,0);
    this.v = new Vector(0,0);
    this.f = 0.8;
    this.w = 6+random(3);
    this.target = null;
    this.d = 200;
    
    this.kill = function(){ return this.target = null; }
    this.done = function(){ return this.target==null; }
    
    this.deploy = function(target){
        if( random(1) <= 0.5 ){
            this.z.x = random(0,width) ; 
            this.z.y = random(1) <= 0.5 ? 0 : height;
        }else{
            this.z.x = random(1) <= 0.5 ? 0 : width ; 
            this.z.y = random(0,height);
        }
        this.target = target;
        angle = _angle(target,this);
        this.v.x = (random(200)+50)*sin(angle);
        this.v.y = (random(200)+50)*cos(angle);
        this.f = 0.9;
        this.d = 200;
    };
    
    this.draw = function(){
        stroke( _white );
        fill( _grey );
        ellipse(this.z.x, this.z.y, this.w*2, this.w*2);
        if( this.target != null ){
            noStroke();
            if( this.d > 150 ) fill( _green );
            else if( this.d < 60 ) fill( _red );
            else fill( _yellow );
            ellipse(this.z.x, this.z.y, this.w*0.7, this.w*0.7);
        }
    };
    
    this.tick = function(){
        if( this.target != null ){
            this.d = _dist( this, this.target );
            if( this.d < 150 ){
                angle = _angle(this.target,this);
                v = this.d < 60 ? 5/(this.d)*(this.d): 1;
                this.v.x += v*sin(angle);
                this.v.y += v*cos(angle);
                this.f = 1;
            }else{
                this.f = 0.8;
            }
        }
        _tick(this);
    };
}

function Explosion(){
    this.z = new Vector(0,0);
    this.w = 0;
    this.t = 0;
    
    this.done = function(){ return this.t<= 0; }
    
    this.draw = function(){
        if( this.done() ) return;
        noStroke();
        for(i=0;i<5;++i){
            fill(random(1)>=0.5? _explosion0:_explosion1,100+random(106));
            ellipse( this.z.x+random(-5,5),
                     this.z.y+random(-5,5),
                     random( this.w*0.5, this.w),
                     random( this.w*0.5, this.w) );
        }
    };
    
    this.tick = function(){
        if( this.done() ) return;
        this.t -= 1/20;
    };
    
    this.deploy = function(x,y,w){
        this.t = 0.3;
        this.w = w;
        this.z.x = x;
        this.z.y = y;
    };
}

function Bullet(){
    this.z = new Vector(0,0);
    this.v = new Vector(0,0);
    this.w = 2;
    this.f = 1; //0.95;
    this.t = 0;
    this.t_max = 2;
    
    this.draw = function(){
        if( this.done() ) return;
        noStroke();
        fill( _bullet );
        rect( this.z.x, this.z.y, this.w, this.w);
    };
    
    this.tick = function(){
        if( this.done() ) return;
        _tick(this);
        this.t -= 1/20;
        this.v.x *= this.f;
        this.v.y *= this.f;
    };
    
    this.kill = function() { this.t = 0; }
    this.done = function() { return this.t <= 0 ; }
    
    this.deploy = function(x,y,vx,vy){
        this.t = this.t_max;
        this.z.x = x;
        this.z.y = y;
        this.v.x = 100*vx;
        this.v.y = 100*vy;
    };
}

function Smoke(){
    this.z = new Vector(0,0);
    this.v = new Vector(0,0);
    this.f = 0.99;
    this.c = random(1) > 0.5 ? _smoke0 : _smoke1;
    
    this.t = 0;
    this.t_max = 3;
    
    this.done = function() { return this.t <= 0; }
    
    this.draw = function() {
        if( this.done() ) return;
        noStroke();
        fill(this.c, 255*(this.t/this.t_max) );
        size = 15-12*(this.t/this.t_max);
        ellipse(this.z.x, this.z.y, size, size);
    };
    
    this.tick = function(){
        if( this.done() ) return;
        this.t -= 1/20;
        _tick(this);
    };
    
    this.deploy = function(x,y,vx,vy) { 
        this.z.x = x+(random(5)-2);
        this.z.y = y+(random(5)-2);
        this.t = this.t_max;
        this.v.x = (random(10)+5)*vx;
        this.v.y = (random(10)+5)*vy;
    };
}

function Ship(x,y){
    this.z = new Vector(x,y);
    this.v = new Vector(0,0);
    this.w = 15;
    this.r = 0;
    this.r_max = 16;
    this.angle = function(){ return TWO_PI/this.r_max*this.r; };
    
    //points
    this.p0 = { x : 15 , y :  0 };
    this.p1 = { x : -5 , y :  5 };
    this.p2 = { x : -5 , y : -5 };

    //points
    this.f0 = { x : -15 , y :  0 };
    this.f1 = { x :  -5 , y :  3 };
    this.f2 = { x :  -5 , y : -3 };
        
    this.smoke = new Array(150);
    for( i=0;i<this.smoke.length;++i)
        this.smoke[i] = new Smoke();
    this.smoke_i = 0;
    
    this.bullets = new Array(10);
    for( i=0;i<this.bullets.length;++i)
        this.bullets[i] = new Bullet();

    this.draw = function(fire){
        for( s in this.smoke )
            this.smoke[s].draw();
        for( b in this.bullets )
            this.bullets[b].draw();

        //ship
        stroke( _white);
        fill( _grey );
        _triangle(this.p0,this.p1,this.p2,this);
        
        //fire
        if( fire ){
            noStroke();
            fill( _fire ,100+random(156));
            _triangle(this.f0,this.f1,this.f2,this);
        }
        
    };
    
    //controls
    this.left  = function() { this.r = (this.r-1) % this.r_max; };
    this.right = function() { this.r = (this.r+1) % this.r_max; };

    this.shoot = function() {
        tmp = _rot(this.p0,this.angle());
        tmp.x += this.z.x;
        tmp.y += this.z.y;
        
        for( i=0;i<this.bullets.length;++i ){        
            if( this.bullets[i].done() ){
                this.bullets[i].deploy(tmp.x,tmp.y,
                    cos( this.angle() ),
                    sin( this.angle() )
                );
                return;
            }
        }
    };

    this.fire = function() {
        this.v.x += 15*cos( this.angle() );
        this.v.y += 15*sin( this.angle() );
        
        tmp = _rot(this.f0,this.angle());
        tmp.x += this.z.x;
        tmp.y += this.z.y;
        
        max = random(3)+1;
        cos_angle = cos( this.angle() + TWO_PI/2 ) ;
        sin_angle = sin( this.angle() + TWO_PI/2 ) ;
        for( i=0;i<max;++i ){        
            this.smoke[this.smoke_i].deploy(tmp.x,tmp.y, cos_angle, sin_angle );
            this.smoke_i = (this.smoke_i+1) % this.smoke.length;
        }
    };
    
    this.brake = function(){
        this.v.x *= 0.8;
        this.v.y *= 0.8;
    };
    
    this.tick = function(){
        _tick(this);
        for( s in this.smoke )
            this.smoke[s].tick();
        for( b in this.bullets )
            this.bullets[b].tick();
    };

}

//
// util functions
//

function _rot(p,angle){
    cos_angle = cos( angle );
    sin_angle = sin( angle );
    return new Vector (
        p.x*cos_angle - p.y*sin_angle , 
        p.x*sin_angle + p.y*cos_angle );
};

function _triangle(p0,p1,p2,ref){
    w0 = _rot(p0,ref.angle());
    w1 = _rot(p1,ref.angle());
    w2 = _rot(p2,ref.angle());
    triangle(
       w0.x + ref.z.x , w0.y + ref.z.y,
       w1.x + ref.z.x , w1.y + ref.z.y, 
       w2.x + ref.z.x , w2.y + ref.z.y
    );
}

function _angle(a,b){
    return atan2(  (a.z.x-b.z.x) , (a.z.y-b.z.y) );
}

function _dist(a,b){
    return sqrt( sq(a.z.x-b.z.x) + sq(a.z.y-b.z.y) );
}

function _bounds(obj){
    if( obj.z.x < 0 ) obj.z.x = width;
    if( obj.z.x > width ) obj.z.x = 0;
    
    if( obj.z.y < 0 ) obj.z.y = height;
    if( obj.z.y > height ) obj.z.y = 0;
}

function _tick(obj){
    //movement
    obj.z.x = obj.z.x + obj.v.x*1/20;
    obj.z.y = obj.z.y + obj.v.y*1/20;
    //friction
    if( obj.f != undefined ){
        obj.v.x *= obj.f;
        obj.v.y *= obj.f;
    }
}

function _collides(p,q){
    d = _dist(p,q);
    return d <= (p.w+q.w);
}

function _update(s,m,e){

    for( i in e )
        e[i].tick();
   
    s.tick();
    for( b in s.bullets ){
        if( !s.bullets[b].done() ){
            for( i in m ){
                if( !m[i].done() && _collides(m[i],s.bullets[b]) ){
                    m[i].kill();
                    s.bullets[b].kill();
                    e[i].deploy(m[i].z.x,m[i].z.y,m[i].w*4);
                    ++kills;
                }
            }
        }
    }
    
    //mines
loop1: for( i in m ){

       if( m[i].done() )
            continue;
        
        m[i].tick();
        
        if( _collides(m[i],s) ){
            w0 = _rot(s.p0,s.angle());
            w0.x += s.z.x;
            w0.y += s.z.y;
            w1 = _rot(s.p1,s.angle());
            w1.x += s.z.x;
            w1.y += s.z.y;
            w2 = _rot(s.p2,s.angle());
            w2.x += s.z.x;
            w2.y += s.z.y;
            if( _intersects( w0, w1, m[i] ) || 
                _intersects( w1, w2, m[i] ) || 
                _intersects( w2, w0, m[i] ) ){
                m[i].kill();
                e[i].deploy(m[i].z.x,m[i].z.y,m[i].w*4);
                ++hits;
            }
        }
        
        for( j in m ){

            if( m[i].done() )
                break loop1;
            
            if( i == j || m[j].done() )
                continue;
            
            if( _collides(m[i],m[j]) ){
                if( m[i].d < 60 ){
                    m[i].kill();
                    e[i].deploy(m[i].z.x,m[i].z.y,m[i].w*4);
                    ++destroyed;
                }
                if( m[j].d < 60 ){
                    m[j].kill();
                    e[j].deploy(m[j].z.x,m[j].z.y,m[j].w*4);
                    ++destroyed;
                }
                if( !m[j].done() && !m[i].done() ){
                    _collision(m[i],m[j]);
                }
            } 
        }
    }

}

//http://www.gamedev.net/community/forums/topic.asp?topic_id=304578
function _intersects(p0,p1,c){
    x0 = c.z.x;
	y0 = c.z.y;
	x1 = p0.x;
	y1 = p0.y;
	x2 = p1.x;
	y2 = p1.y;
	n = abs((x2-x1)*(y1-y0)-(x1-x0)*(y2-y1));
	d = sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	dist = n/d;
	if(dist > c.w) return false;
	d1 = sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
	if((d1-c.w) > d) return false;
	d2 = sqrt((x0-x2)*(x0-x2)+(y0-y2)*(y0-y2));
	if((d2-c.w) > d) return false;
	return true;
}

//http://gmc.yoyogames.com/index.php?showtopic=446075
function _collision(a,b){
    dx=b.z.x-a.z.x;
    dy=b.z.y-a.z.y;
    dis=sqrt( dx*dx + dy*dy );
    
    if( dis > (a.w+b.w) )
        return;
    //normalize
    dx/=dis;
    dy/=dis;
                        
    //calculate the component of velocity in the direction
    vp1=a.v.x*dx+a.v.y*dy;
    vp2=b.v.x*dx+b.v.y*dy;
    
    if( (vp1-vp2)==0 )
        return;
    
    dt=(a.w+b.w-dis)/(vp1-vp2);

    //move the balls back so they just touch
    a.z.x -= a.v.x*dt;
    a.z.y -= a.v.y*dt;
    //b.z.x -= b.v.x*dt;
    //b.z.y -= b.v.y*dt;
    
    //projection of the velocities in these axes
    va1=(a.v.x*dx+a.v.y*dy); 
    vb1=(a.v.y*dx-a.v.x*dy);
    va2=(b.v.x*dx+b.v.y*dy); 
    vb2=(b.v.y*dx-b.v.x*dy);
                  
    //new velocities in these axes. take into account the mass of each ball.
    vaP1=(va1+(va2-va1))/(1+a.w/b.w);
    vaP2=(va2+(va1-va2))/(1+b.w/a.w);
                                
    a.v.x = vaP1*dx-vb1*dy; 
    a.v.y = vaP1*dy+vb1*dx;
    b.v.x = vaP2*dx-vb2*dy;  
    b.v.y = vaP2*dy+vb2*dx;
                                
    //we moved the balls back in time, so we need to move them forward
    a.z.x += a.v.x*dt;
    a.z.y += a.v.y*dt;
    //b.z.x += b.v.x*dt;
    //b.z.y += b.v.y*dt;
}

//
//
//
