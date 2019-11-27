/***
* Name: ReChamp
* Author: Arnaud Grignard, Nicolas Ayoub
* Description: ReChamp - 2019
* Tags: Tag1, Tag2, TagN
***/

model ReChamp

global {
	file buildings_shapefile <- file("../includes/GIS/buildings.shp");
	file green_spaces_shapefile <- file("../includes/GIS/green_space.shp");
	file ilots_shapefile <- file("../includes/GIS/ilots.shp");
	file water_shapefile <- file("../includes/GIS/water.shp");
	file roads_shapefile <- file("../includes/GIS/roads.shp");
	file roads_count_shapefile <- file("../includes/GIS/gksection.shp");
	file shape_file_bounds <- file("../includes/GIS/TableBounds.shp");
	file bus_shapefile <- file("../includes/GIS/lignes_bus.shp");
	file metro_shapefile <- file("../includes/GIS/lignes_metro_RER.shp");
	file station_shapefile <- file("../includes/GIS/stations_metro_bus_RER.shp");
	
	geometry shape <- envelope(shape_file_bounds);
	graph the_graph;
	bool realData<-true;
	
	bool showRoad parameter: 'Show Road' category: "Parameters" <-false;
	bool showBuilding parameter: 'Show Building' category: "Parameters" <-true;
	bool showBus parameter: 'Show Bus' category: "Parameters" <-false;
	bool showMetro parameter: 'Show Metro' category: "Parameters" <-true;
	bool showAgent parameter: 'Show Agent' category: "Parameters" <-true;
	bool showTrace parameter: 'Show Trace' category: "Parameters" <-false;
	bool showStation parameter: 'Show Station' category: "Parameters" <-false;
	
	map<string, rgb> metro_colors <- ["1"::rgb("#FFCD00"), "2"::rgb("#003CA6"),"3"::rgb("#837902"), "6"::rgb("#E2231A"),"7"::rgb("#FA9ABA"),"8"::rgb("#E19BDF"),"9"::rgb("#B6BD00"),"12"::rgb("#007852"),"13"::rgb("#6EC4E8"),"14"::rgb("#62259D")];
	

	
	float angle<-26.5;
	
	//FRENCH FLAG
	list<geometry> flag <-[rectangle(shape.width/3,shape.height) at_location {shape.width/6,shape.height/2} rotated_by angle,
		rectangle(shape.width/3,shape.height) at_location {shape.width/3+shape.width/6,shape.height/2} rotated_by angle,
		rectangle(shape.width/3,shape.height) at_location {2*shape.width/3+shape.width/6,shape.height/2} rotated_by angle	
	];
	
	init {
		create greenSpace from: green_spaces_shapefile ;
		create building from: buildings_shapefile with: [depth:float(read ("H_MOY")),date_of_creation:int(read ("AN_CONST"))];
		create ilots from: ilots_shapefile ;
		create water from: water_shapefile ;
		create bus_line from: bus_shapefile ;
		create station from: station_shapefile ;
		create metro_line from: metro_shapefile with: [number:string(read ("c_ligne")),nature:string(read ("c_nature"))];
		if(realData){
			create road from: roads_count_shapefile with: [capacity:float(read ("assig_lveh"))];
			float maxCap<- max(road collect each.capacity);
			float minCap<- min((road where (each.capacity >0) )collect each.capacity);
			ask road {
				color<-blend(#red, #yellow,(minCap+capacity)/(maxCap-minCap));
				create people number:self.capacity/500{
					location<-any_location_in(myself);
					color<-blend(#red, #yellow,(minCap+myself.capacity)/(maxCap-minCap));
					nationality <- flip(0.3) ? "french" :"foreigner"; 
					if flip(0.1){
						location<-any_location_in(one_of(greenSpace));
					}	
				}
			}
		}else{
		  create road from: roads_shapefile {
		  	color<-#white;
		  }	
		  create people number:2000{
			color<-flip (0.33) ? #blue : (flip(0.33) ? #white : #red);
			location<-any_location_in(one_of(road));
			nationality <- flip(0.3) ? "french" :"foreigner"; 	
		}	
		}
		
		the_graph <- as_edge_graph(road);
	}
}

species building {
	string type; 
	int date_of_creation;
	float depth;
	rgb color <- #white  ;
	
	aspect base {
		if(showBuilding){
		  draw shape color: color border:rgb(125,125,125);	
		}
	}
	
	aspect depth {
		draw shape color: color border:rgb(125,125,125) depth:depth;
	}
	
	
	aspect timelaspe{
		if(cycle>date_of_creation and date_of_creation!=0){
		  draw shape color: color border:rgb(125,125,125) depth:depth;	
		}	
	}
}

species ilots {
	string type; 
	rgb color <- rgb(175,175,175)  ;
	
	aspect base {
		draw shape color: color ;
	}
}

species greenSpace {
	string type; 
	rgb color <- #darkgreen  ;
	
	aspect base {
		draw shape color: rgb(75,75,75) ;
	}
	aspect green {
		draw shape color: #darkgreen ;
	}
}

species water {
	string type; 
	rgb color <- rgb(25,25,25)  ;
	
	aspect base {
		draw shape color:color ;
	}
}

species road  {
	rgb color;
	float capacity;
	float capacity_pca;
	aspect base {
		if(showRoad){
		  draw shape color: color width:3;	
		}
		
	}
}

species bus_line{
	rgb color;
	float capacity;
	float capacity_pca;
	aspect base {
		if(showBus){
		  draw shape color: color width:3;	
		}
		
	}
}

species station{
	rgb color;
	float capacity;
	float capacity_pca;
	aspect base {
		if(showStation){
		  draw circle(10) color: #blue width:3;	
		}
		
	}
}


species metro_line{
	rgb color;
	float capacity;
	float capacity_pca;
	string number;
	string nature;
	aspect base {
		if(showMetro){
		  draw shape color: metro_colors[number] width:3;	
		}
		
	}
}

species people skills:[moving]{	
	rgb color;
	point target;
	string nationality;
	string profile;
	string aspect;
	
	reflex move{
      do wander on:the_graph speed:10.0;
      //do wander  speed:10.0;
	}
	aspect base {
	  draw circle(4#m) color:#red  ;
	}
	aspect congestion {
	  draw circle(4#m) color:color  ;
	}
	aspect nationality{
	  draw circle(4#m) color:(nationality=("french")) ? #white : #red  ;
	  if(nationality=("french")){
	    draw circle(8#m) - circle(6#m) color:#green;
	  }
	}	
	aspect french{
	  draw circle(4#m) color:self intersects flag[0] ?  #blue : (self intersects flag[1] ? #white : #red) ;
	}
}

experiment ReChamp type: gui autorun:false{
	float minimum_cycle_duration<-0.025;	
	output {
		display champ type:opengl background:#black draw_env:false rotate:angle fullscreen:true toolbar:false autosave:false synchronized:true
		camera_pos: {1812.4353,1518.768,3050.5367} camera_look_pos: {1812.4353,1518.7147,0.0} camera_up_vector: {0.0,1.0,0.0}{	
			//species ilots aspect: base ;
			species building aspect: base transparency:0.5;
			species greenSpace aspect: base ;
			species water aspect: base;
			species road aspect: base;
			species bus_line aspect: base;
			species station aspect: base;
			species metro_line aspect: base;
			//species people aspect:congestion;// trace:showTrace ? 200 :0 fading:true;
			
			graphics 'modelbackground'{
				//draw shape_file_bounds color:#gray;
			}
			
			graphics 'tablebackground'{
				draw geometry(shape_file_bounds)*1.25 color:#white empty:true;
			}
			event["t"] action: {showTrace<-!showTrace;};
			event["b"] action: {showBuilding<-!showBuilding;};
			event["r"] action: {showRoad<-!showRoad;};
			event["m"] action: {showMetro<-!showMetro;};
			event["n"] action: {showBus<-!showBus;};
			event["s"] action: {showStation<-!showStation;};
		}
	}
}

experiment Ep1 type: gui autorun:false parent:ReChamp{
	output {
		display city_display type:opengl background:#black draw_env:false rotate:angle fullscreen:true toolbar:false parent:champ{
			species people aspect:base;	
		}
	}
}