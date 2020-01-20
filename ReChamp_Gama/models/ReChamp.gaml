  /***
* Name: ReChamp
* Author: Arnaud Grignard, Tri Nguyen-Huu, Patrick Taillandier, Nicolas Ayoub 
* Description: ReChamp - 2019
* Tags: Tag1, Tag2, TagN
***/

model ReChamp

global {
	//EXISTING SHAPEFILE (FROM OPENDATA and OPENSTREETMAP)
	file shape_file_bounds <- file("../includes/GIS/TableBounds.shp");
	file buildings_shapefile <- file("../includes/GIS/buildings.shp");
	
	file water_shapefile <- file("../includes/GIS/water.shp");
	file roads_shapefile <- file("../includes/GIS/roads_OSM.shp");
	file nodes_shapefile <- file("../includes/GIS/nodes_OSM.shp");
	file signals_zone_shapefile <- file("../includes/GIS/signals_zone.shp");
	
	file bus_shapefile <- file("../includes/GIS/lignes_bus.shp");
	file metro_shapefile <- file("../includes/GIS/lignes_metro_RER.shp");
	file station_shapefile <- file("../includes/GIS/stations_metro_bus_RER.shp");
	file amenities_shapefile <- file("../includes/GIS/COMMERCE_RESTAURATION_HOTELLERIE.shp");
	file amenities_shop_shapefile <- file("../includes/GIS/COMMERCE_NON_ALIMENTAIRE.shp");
	file bikelane_shapefile <- file("../includes/GIS/reseau-cyclable_reconnected.shp");
	
	//GENERATED SHAPEFILE (FROM QGIS)
	//INTERVENTION
	file coldspot_shapefile <- file("../includes/GIS/Coldspot.shp");
	file intervention_shapefile <- file("../includes/GIS/Intervention.shp");		
	//MOBILITY
	file Mobility_Now_shapefile <- file("../includes/GIS/PCA_CE_EXP_EXI_MOBILITY_ABSTRACT.shp");
	file Mobility_Future_shapefile <- file("../includes/GIS/PCA_CE_EXP_PRO_MOBILITY_ABSTRACT.shp");
	//NATURE
	file Nature_Now_shapefile <- file("../includes/GIS/PCA_CE_EXP_EXI_NATURE.shp");
	file Nature_Future_shapefile <- file("../includes/GIS/PCA_CE_EXP_PRO_NATURE.shp");
	//USAGE
	file Usage_Now_shapefile <- file("../includes/GIS/PCA_CE_EXP_EXI_USAGE.shp");
	file Usage_Future_shapefile <- file("../includes/GIS/PCA_CE_EXP_PRO_USAGE.shp");

	file Waiting_line_shapefile <- shape_file("../includes/GIS/Waiting_line.shp");

	geometry shape <- envelope(shape_file_bounds);
	graph people_graph;
	graph bike_graph;
	graph bus_graph;
	
	graph driving_road_network;
	
	float max_dev <- 10.0;
	float fuzzyness <- 1.0;
	float dist_group_traffic_light <- 50.0;

	
	bool showCar parameter: 'Car (c)' category: "Agent" <-true;
	bool showPedestrian parameter: 'Pedestrain (p)' category: "Agent" <-true;
	bool showBike parameter: 'Bike (b)' category: "Agent" <-true;
	

	bool showVizuRoad parameter: 'Mobility(m)' category: "Infrastructure" <-true;
	bool showGreen parameter: 'Nature (n)' category: "Infrastructure" <-true;
	bool showUsage parameter: 'Usage (u)' category: "Infrastructure" <-true;

	bool showPeopleTrajectory parameter: 'People Trajectory' category: "Trajectory" <-true;
	bool showCarTrajectory parameter: 'Car Trajectory' category: "Trajectory" <-true;
	bool showBikeTrajectory parameter: 'Bike Trajectory' category: "Trajectory" <-true;
	int trajectoryLength <-10 parameter: 'Trajectory length' category: "Trajectory" min: 0 max: 25;
	bool smoothTrajectory parameter: 'Smooth Trajectory' category: "Trajectory" <-true;
	
	bool showBikeLane  parameter: 'Bike Lane (v)' category: "Parameters" <-false;
	bool showBusLane parameter: 'Bus Lane(j)' category: "Parameters" <-false;
	bool showMetroLane parameter: 'Metro Lane (q)' category: "Parameters" <-false;
	bool showStation parameter: 'Station (s)' category: "Parameters" <-false;
	bool showTrafficSignal parameter: 'Traffic signal (t)' category: "Parameters" <-false;
	bool showBuilding parameter: 'Building (b)' category: "Parameters" <-false;
	bool showRoad parameter: 'Road Simu(r)' category: "Parameters" <-false;
	
	bool showWater parameter: 'Water (w)' category: "Parameters" <-false;
	bool showAmenities parameter: 'Amenities (a)' category: "Parameters" <-false;
	bool showIntervention parameter: 'Intervention (i)' category: "Parameters" <-false;
	bool showBackground <- false parameter: "Background (Space)" category: "Parameters";
	
	float trajectoryTransparency <-0.2 parameter: 'Trajectory transparency' category: "Trajectory" min: 0.0 max: 1.0;
	bool showGif  parameter: 'Gif (g)' category: "Parameters" <-false;
	bool showHotSpot  parameter: 'HotSpot (h)' category: "Parameters" <-false;
	int currentBackGround <-0;
	list<file> backGrounds <- [file('../includes/PNG/PCA_REF.png'),file('../includes/PNG/PCA_REF.png')];
	list<string> interventionGif0 <- [('../includes/GIF/Etoile/Etoile_0.gif'),('../includes/GIF/Champs/Champs_0.gif'),('../includes/GIF/Palais/Palais_0.gif'),('../includes/GIF/Concorde/Concorde_0.gif')];
    list<string> interventionGif1 <- [('../includes/GIF/Etoile/Etoile_1.gif'),('../includes/GIF/Champs/Champs_1.gif'),('../includes/GIF/Palais/Palais_1.gif'),('../includes/GIF/Concorde/Concorde_1.gif')];
    
	bool right_side_driving <- true;
	string transition0to_1<-'../includes/GIF/Etoile/Etoile_1.gif';
	
	map<string, rgb> metro_colors <- ["1"::rgb("#FFCD00"), "2"::rgb("#003CA6"),"3"::rgb("#837902"), "6"::rgb("#E2231A"),"7"::rgb("#FA9ABA"),"8"::rgb("#E19BDF"),"9"::rgb("#B6BD00"),"12"::rgb("#007852"),"13"::rgb("#6EC4E8"),"14"::rgb("#62259D")];
	map<string, rgb> type_colors <- ["default"::#white,"people"::#yellow, "car"::rgb(204,0,106),"bike"::rgb(18,145,209), "bus"::rgb(131,191,98)];
	map<string, rgb> voirie_colors <- ["Piste"::#white,"Couloir Bus"::#green, "Couloir mixte bus-vélo"::#red,"Piste cyclable"::#blue];
	map<string, rgb> nature_colors <- ["exi"::rgb(115,212,0),"pro"::rgb(173,255,77)];
	map<string, rgb> usage_colors <- ["exi"::rgb(120,120,120),"pro"::rgb(255,0,0)];
	
	float angle<-26.25;

	string currentSimuState_str <- "present" among: ["present", "future"];
	int currentSimuState<-0;
	bool updateSim<-true;
	int nbAgent<-2000;


	float step <- 2 #sec;
	map<string,float> mobilityRatio <-["people"::0.5, "car"::0.3,"bike"::0.2, "bus"::0];

	
	map<bikelane,float> weights_bikelane;
	
//	map<road,float> proba_use_road;
	list<intersection> input_intersections;
	list<intersection> output_intersections;
	list<intersection> possible_targets; 
	map<agent,float> proba_choose_park;
	map<agent,float> proba_choose_culture;
	list<intersection> tf_can_be_desactivated;
	
	list<park> activated_parks;
	list<culture> activated_cultures;
	list<intersection> vertices;
	
		
  //	list<point,geometry> queue_per_loc;

	
	
	init {
		
		//------------------ STATIC AGENT ----------------------------------- //
			create park from: (Nature_Future_shapefile) with: [type:string(read ("type"))] {
			state<<"future";
			if (shape = nil or shape.area = 0 or not(shape overlaps world)) {
				do die;
			}
			
		}
		loop g over: Nature_Now_shapefile {
			
			if (g != nil and not empty(g)) and (g overlaps world) {
				park p <- (park first_with(each.shape.area = g.area));
				//park p <- first(park overlapping g.location);
				if (p = nil) {p <- park first_with (each.location = g.location);}
				if (p != nil){p.state << "present";}
			}
		
			
		}
		create culture from: Usage_Future_shapefile where (each != nil) with: [type:string(read ("type"))]{
			state<<"future";
			if (shape = nil or shape.area = 0) {
				do die;
			}
		}
		loop g over: Usage_Now_shapefile where (each != nil and each.area > 0) {
			culture p <- (culture first_with(each.shape.area = g.area));
			//p <- first(culture overlapping g.location);
			if (p = nil) {p <- culture first_with (each.location = g.location);}
			if (p != nil){p.state << "present";}
		}
		
		create vizuRoad from: Mobility_Now_shapefile with: [type:string(read ("type"))] {
			state<<"present";
		}
		create vizuRoad from: Mobility_Future_shapefile with: [type:string(read ("type"))] {
			state<<"future";
		}
		
		do manage_waiting_line;
		create building from: buildings_shapefile with: [depth:float(read ("H_MOY"))];
		create intersection from: nodes_shapefile with: [is_traffic_signal::(read("type") = "traffic_signals"),  is_crossing :: (string(read("crossing")) = "traffic_signals"), group :: int(read("group")), phase :: int(read("phase"))];
		create signals_zone from: signals_zone_shapefile;
		//create road agents using the shapefile and using the oneway column to check the orientation of the roads if there are directed
		create road from: roads_shapefile with: [lanes::int(read("lanes")), oneway::string(read("oneway")), is_tunnel::(read("tunnel")="yes"?true:false)] {
			maxspeed <- (lanes = 1 ? 30.0 : (lanes = 2 ? 40.0 : 50.0)) °km / °h;
				ref_lanes <- lanes;
					
			switch oneway {
				match "no" {
					create road {
						lanes <- myself.lanes;
						ref_lanes <- lanes;
						pro_lanes <- myself.pro_lanes;
						shape <- polyline(reverse(myself.shape.points));
						maxspeed <- myself.maxspeed;
						is_tunnel <- myself.is_tunnel;
						oneway <- myself.oneway;
					}
				}

				match "-1" {
					shape <- polyline(reverse(shape.points));
				}
			}
		}
		

		ask road{
			loop i from: 0 to: length(shape.points) -2{
				point vec_dir <- (shape.points[i+1]-shape.points[i])/norm(shape.points[i+1]-shape.points[i]);
				point vec_ortho <- {vec_dir.y,-vec_dir.x}*(right_side_driving?-1:1);
				vec_ref << [vec_dir,vec_ortho];
			}
		}

		//creation of the road network using the road and intersection agents
		driving_road_network <- (as_driving_graph(road, intersection)) use_cache false ;
		vertices <- list<intersection>(driving_road_network.vertices);
		loop i from: 0 to: length(vertices) - 1 {
			vertices[i].id <- i; 
		}
		output_intersections <- intersection where (empty(each.roads_out));
		input_intersections <- intersection where (empty(each.roads_in));
		possible_targets <- intersection - input_intersections;
//		proba_use_road <- road as_map (each::each.proba_use);
		do check_signals_integrity;
		
		do updateSimuState;
		
		create water from: water_shapefile ;
		create station from: station_shapefile with: [type:string(read ("type"))];
		create coldSpot from:coldspot_shapefile;
		
		//------------------- NETWORK -------------------------------------- //
		create metro_line from: metro_shapefile with: [number:string(read ("c_ligne")),nature:string(read ("c_nature"))];
		//do manage_cycle_network;
		create bikelane from:bikelane_shapefile{
			color<-type_colors["bike"];
		}
		create bus_line from: bus_shapefile{
			color<-type_colors["bus"];
		}
		
		//------------------- AGENT ---------------------------------------- //
		do create_cars(round(nbAgent*mobilityRatio["car"]));
		
		//Create Pedestrain
		create pedestrian number:nbAgent*mobilityRatio["people"]{
		  val_f <- rnd(-max_dev,max_dev);
		  current_trajectory <- [];
		  type <- "people";
			if flip(0.3) {
				target_place <- proba_choose_park.keys[rnd_choice(proba_choose_park.values)];
				target <- (any_location_in(target_place));
				location<-copy(target);
				state <- "stroll";
				
				
			} else {
				location<-any_location_in(one_of(road));
			}
		  	
		}
		
        //Create Bike
	    create bike number:nbAgent*mobilityRatio["bike"]{
	      type <- "bike";
		  location<-any_location_in(one_of(building));	
		}
				
		people_graph <- as_edge_graph(road);
			
		weights_bikelane <- bikelane as_map(each::each.shape.perimeter);
		map<bikelane,float> weights_bikelane_sp <- bikelane as_map(each::each.shape.perimeter * (each.from_road ? 10.0 : 0.0));
		
		bike_graph <- (as_edge_graph(bikelane) with_weights weights_bikelane_sp) ;
		
			//Graphical Species (gif loader)
		create graphicWorld from:shape_file_bounds;
		
		//First Intervention (Paris Now)
		create intervention from:intervention_shapefile with: [id::int(read ("id")),type::string(read ("type"))]
		{   gifFile<-interventionGif0[id-1];
			do initialize;
			interventionNumber<-1;
			isActive<-true;
		}
		//Second Intervention (PCA proposal)
		create intervention from:intervention_shapefile with: [id::int(read ("id")),type::string(read ("type"))]
		{   gifFile<-interventionGif1[id-1];
			do initialize;
			interventionNumber<-2;
			isActive<-false;
		}	
		ask intervention {
			ask road overlapping self {
				hot_spot <- true;
			}
		}	
		ask intersection where each.is_traffic_signal{
			if empty(signals_zone overlapping self){
				is_traffic_signal <- false;
			}
		}
		
		do init_traffic_signal;
		ask intersection where each.is_traffic_signal {
			if (roads_in first_with (road(each).pro_lanes > 0) = nil) {
				tf_can_be_desactivated << self;
			}
		}
		//map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 10) * each.shape.perimeter / each.maxspeed));
		map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 10) *(each.shape.perimeter / each.maxspeed) / (1+each.lanes)));
		driving_road_network <- driving_road_network with_weights general_speed_map; 
	}
	
	action create_cars(int nb) {
		create car number:nb{
		 	type <- "car";
		  	max_speed <- 160 #km / #h;
		  	speed<-15 #km/#h + rnd(10 #km/#h);
			vehicle_length <- 10.0 #m;
			right_side_driving <- myself.right_side_driving;
			proba_lane_change_up <- 0.1 + (rnd(500) / 500);
			proba_lane_change_down <- 0.5 + (rnd(500) / 500);
			current_intersection <- one_of(intersection - output_intersections);
			location <-current_intersection.location;
			security_distance_coeff <- 5 / 9 * 3.6 * (1.5 - rnd(1000) / 1000);
			proba_respect_priorities <- 1.0;// - rnd(200 / 1000);
			proba_respect_stops <- [1.0];
			proba_block_node <- 0.0;
			proba_use_linked_road <- 0.0;
			max_acceleration <- 5 / 3.6;
			speed_coeff <- 1.2 - (rnd(400) / 1000);
		}
	}
	
	action init_traffic_signal { 
		
		list<intersection> traffic_signals <- intersection where each.is_traffic_signal ;
		list<intersection> to_remove <- traffic_signals where empty(each.roads_in);
		ask to_remove {
			is_traffic_signal <- false;
		}
		traffic_signals <- traffic_signals -to_remove;
		ask traffic_signals {
			stop << [];
		}
		
		
		loop i over: (remove_duplicates(traffic_signals collect(each.group)) - 0) {
			list<intersection> gp <- traffic_signals where(each.group = i);
			rgb col <- rnd_color(255);
			int cpt_init <- rnd(100);
			bool green <- flip(0.5);
			ask gp {
				color_group <- col;
				point centroide <- mean (gp collect (intersection(each)).location);
				loop rd over: roads_in {
					road r <- road(rd);
					bool inward <- distance_to(centroide, first(rd.shape.points)) > distance_to(centroide, last(rd.shape.points));
					if length(roads_in) = 1{// trouver un truc moins moche et plus générique pour ça
						ways1 << r;
					}else if inward {
						ways1 << r;
					}
					if phase = 1 {
						if green{do to_green;}else{do to_red;}
					}else{
						if green{do to_red;}else{do to_green;}
					}
				counter <- cpt_init;	
				}
			}
		}
		
		list<list<intersection>> groupes <- traffic_signals where (each.group = 0) simple_clustering_by_distance dist_group_traffic_light;
		loop gp over: groupes {
			rgb col <- rnd_color(255);
			ask gp {color_group <- col;}
			int cpt_init <- rnd(100);
			bool green <- flip(0.5);
			if (length(gp) = 1) {
				ask (intersection(first(gp))) {
					if (green) {do to_green;} 
					else {do to_red;}
					float ref_angle <- 0.0;
					if (length(roads_in) >= 2) {
						road rd0 <- road(roads_in[0]);
						list<point> pts <- rd0.shape.points;
						ref_angle <- float(last(pts) direction_to rd0.location);
					}
					do compute_crossing(ref_angle);
				}	
			} else {
				point centroide <- mean (gp collect (intersection(each)).location);
				float angle_ref <- centroide direction_to intersection(first(gp)).location;
				bool first <- true;
				float ref_angle <- 0.0;
				ask first(gp where (length(each.roads_in) > 0)) {
					road rd0 <- road(roads_in[0]);
					list<point> pts <- rd0.shape.points;
					ref_angle <- float(last(pts) direction_to rd0.location);
				}
				
				loop si over: gp {
					intersection ns <- intersection(si);
					bool green_si <- green;
					float ang <- abs((centroide direction_to ns.location) - angle_ref);
					if (ang > 45 and ang < 135) or  (ang > 225 and ang < 315) {
						green_si <- not(green_si);
					}
					ask ns {
						counter <- cpt_init;
						
						if (green_si) {do to_green;} 
							else {do to_red;}
						if (not empty(roads_in)) {
							do compute_crossing(ref_angle);
						}
					}	
				}
			}
		}
		ask traffic_signals where (each.group = 0){
			loop rd over: roads_in {
				if not(rd in ways2) {
					ways1 << road(rd);
				}
			}
		} 
	}
	
	
	//on pourrait le virer, c'est juste a utiliser une fois (je laisse pour le moment pour ref)
	action manage_cycle_network {

		list<geometry> lines <- copy(bikelane_shapefile.contents);
		list<geometry> lines2 <- (roads_shapefile.contents);
		graph g <- as_edge_graph(lines);
		loop v over: g.vertices {
			if (g degree_of v) = 1{
				geometry r <- lines2 closest_to v;
				if (v distance_to r) < 20.0 {
					point pt <- (v closest_points_with r)[1];
					if (pt != first(r.points) and pt != last(r.points)) {
						lines2 >> r;
						list<geometry> sl <- r split_at pt;
						lines2 <- lines2 + sl;
					}
					lines2 << line([v,pt]);
				} 
			}
		}
		lines2 <- lines2 where (each != nil  and each.perimeter > 0);
		
		lines <- lines + lines2;
		lines <- clean_network(lines,3.0, true,true);
		
		list<float> ref <- bikelane_shapefile.contents collect each.perimeter;
		create bikelane from:lines{
			from_road <- not (shape.perimeter in ref) ;
			color<-from_road ? #red : type_colors["bike"];
		}
		create bikelane from:list(road);
		save bikelane type: shp to: "../includes/GIS/reseau-cyclable_reconnected.shp" with: [from_road::"from_road"];
		
	}
	
	reflex updateSimuState when:updateSim=true{
		do updateSimuState;
	}

	//j'ai vire car je sais pas a quoi cela sert
	reflex update_cars when: false{
		ask first(100,shuffle(car where(each.to_update))){
			//do update;
		}
		//write car count(each.to_update);
	}
	
	list<intersection> nodes_for_path (intersection source, intersection target, file ssp){
		
		list<intersection> nodes <- [];
		int id <- source.id;
		int target_id <- target.id;
		int cpt <- 0;
		loop while: id != target_id {
			nodes << intersection(vertices[id]);
			id <- int(ssp[target_id, id]);
			cpt <- cpt +1;
			if (id = -1 or cpt > 50000) {
				return list<intersection>([]);
			}
		}
		nodes<<target;
		return nodes;
	}
	
	action manage_waiting_line {
		loop wl over: Waiting_line_shapefile.contents {
			culture cult <- culture closest_to wl;
			
			ask cult {
				queue <- wl;
				do manage_queue;
			}
			
		}
		ask culture where (each.queue = nil) {
			do default_queue;
		}
	}
	
	action updateSimuState {
		if (currentSimuState = 0){
			currentSimuState_str <- "present";
			ask road {do change_number_of_lanes(ref_lanes);}
			ask tf_can_be_desactivated {
				active <- true;
			}
			possible_targets <- intersection - input_intersections;			
		}
		if (currentSimuState = 1){	
			currentSimuState_str <- "future";
			ask road {do change_number_of_lanes(pro_lanes);}
			
			list<car> car_to_update <- car where ((each.target_intersection in tf_can_be_desactivated) or each.use_blocked_road()) ;
			ask car_to_update{
				if (current_road != nil) {
					ask current_road as road {
						do unregister(myself);
					}
				}
				final_target <- nil;
				target_intersection <- nil;
				fade_count <- rnd(5,30);
			}
			ask tf_can_be_desactivated {
				stop[0] <- [];
				active <- false;
			}
			possible_targets <- intersection - input_intersections - tf_can_be_desactivated;
			
		}
//		ask car {self.to_update <- true;}
		updateSim<-false;
		if (driving_road_network != nil) {
			map general_speed_map <- road as_map (each:: !each.to_display ? 1000000000.0 : ((each.hot_spot ? 1 : 10) * (each.shape.perimeter / each.maxspeed)/(1+each.lanes)));
			driving_road_network <- driving_road_network with_weights general_speed_map;	
		}
		
		activated_parks <- park where (currentSimuState_str in each.state);
		activated_cultures <- culture where (currentSimuState_str in each.state);
		ask  (culture - activated_cultures) {
			ask waiting_tourists {
				do die;
			}
			waiting_tourists <- [];
		}
		list<agent> to_remove <- (park - activated_parks) + (culture - activated_cultures);
		ask pedestrian {
			if (target_place in to_remove) {
				do die;
			}
		}
		proba_choose_park <- activated_parks as_map (each::each.shape.area);
		proba_choose_culture <- activated_cultures as_map (each::each.shape.area);
	}
	
	// ne pas effacer ce qui suit, c'est pour des tests tant qu'on risque de modifier les shapefiles
	action check_signals_integrity{
		ask input_intersections where(each.group != 0){
			write "intersection "+self+" from group "+self.group+" is an input intersection";
		}
		ask output_intersections where(each.group != 0){
			write "intersection "+self+" from group "+self.group+" is an output intersection";
		}
	}
	
}

species culture{
	list<string> state;
	string type;
	float capacity_per_min <- 1.0;
	geometry queue;
	list<pedestrian> people_waiting;
	list<pedestrian> waiting_tourists;
	list<point> positions;
	geometry waiting_area;
	
	//float queue_length <- 10.0;
	
	action default_queue {
		point pt <- any_location_in(shape.contour);
	 	float vect_x <- (location.x - pt.x) ; 
		float vect_y <- (location.y - pt.y) ; 
		
		queue <- line([pt, pt - {vect_x,vect_y}]);
		do manage_queue();
		
	}
	
	action manage_queue {
		positions <- queue points_on (2.0); 
		waiting_area <- (last(positions) + 10.0)  - (queue + 1.0);
	}
	action add_people(pedestrian the_tourist) {
		if (length(waiting_tourists) < length(positions)) {
			the_tourist.location <- positions[length(waiting_tourists)];
		} else {
			the_tourist.location  <- any_location_in(waiting_area);
		}
		waiting_tourists << the_tourist;
	}
	
	reflex manage_visitor when: not empty(waiting_tourists) and every(60 / capacity_per_min) {
		pedestrian the_tourist <- first(waiting_tourists);
		waiting_tourists >> the_tourist;
		the_tourist.ready_to_visit<-true;
		if (not empty(waiting_tourists)) {
			loop i from: 0 to: length(waiting_tourists) - 1 {
				if (i < length(positions)) {
					waiting_tourists[i].location <- positions[i];
				}
			}
		
		}
		
	}
	
	aspect base {
		if(showUsage and (currentSimuState_str in state)){
		  draw shape color: usage_colors[type];	
		  draw queue color: #white;
		}  	
	}
}

species vizuRoad{
	list<string> state;
	string type;
	aspect base {
		if(showVizuRoad and (currentSimuState_str in state)){
			draw shape color:type_colors[type];	
		}
	}
}

species building {
	string type; 
	float depth;
	rgb color <- rgb(75,75,75);
	aspect base {
		if(showBuilding){
		  draw shape color:rgb(75,75,75) empty:true;	
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


species park {
	list<string> state;
	string type; 
	rgb color <- #darkgreen  ;
	
	aspect base {
		if(showGreen and (currentSimuState_str in state)){
		  draw shape color: nature_colors[type]-100 border:nature_colors[type];	
		}	
	}

}

species amenities{
	string type; 
	rgb color <- #darkgray  ;
	
	aspect base {
		if(showAmenities){
		  draw square(5) color: color ;	
		}	
	}
}



species water {
	string type; 
	rgb color <- rgb(25,25,25)  ;
	
	aspect base {
		if(showWater){
		  draw shape color:color ;	
		}	
	}
}



species road  skills: [skill_road]  {
	int id;
	bool is_tunnel <- false;
	rgb color;
	string mode;
	float proba_use <- 100.0;

	float capacity;		
	string oneway;
	bool hot_spot <- false;

	list<list<point>> vec_ref;
	bool to_display <- true;
	
	int pro_lanes;
	int ref_lanes;
	

	
	//action (pas jolie jolie) qui change le nombre de voie d'une route.
	action change_number_of_lanes(int new_number) {
		if new_number = 0{
			to_display <- false;
		}else {
			to_display <- true;
			int prev <- lanes;
			if prev < new_number {
				list<list<list<agent>>> new_agents_on;
				int nb_seg <- length(agents_on[0]);
				loop i from: 0 to: new_number - 1 {
					if (i < prev) {
						list<list<agent>> ags_per_lanes <- agents_on[i];
						new_agents_on << ags_per_lanes;
					} else {
						list<list<agent>> ags_per_lanes <- [];
						loop times: nb_seg {
							ags_per_lanes << [];
						}
						new_agents_on << ags_per_lanes;
					}	
				}
				agents_on <- new_agents_on;
			//	lanes <- new_number;
			} else if prev > new_number {
				list<list<list<agent>>> new_agents_on;
				int nb_seg <- length(shape.points) - 1;
				loop i from: 0 to: prev - 1 {
					list<list<agent>> ags_per_lanes <- agents_on[i];
					if (i < new_number) {
						new_agents_on << ags_per_lanes;
					} else {
						loop j from: 0 to: nb_seg -1 {
							list<car> ags <- list<car>(ags_per_lanes[j]);
							loop ag over: ags {
								new_agents_on[new_number - 1][j] << ag;
								ag.current_lane <- 0;
							}
						} 	
					}
				}
			//	lanes <- new_number;
				agents_on <- new_agents_on;		
			}
			lanes <- new_number;		
		}
	}
	float compute_offset(int current_lane){
		return (oneway='no')?((lanes - min([current_lane,lanes -1]) - 0.5)*3 + 0.25):((0.5*lanes - min([current_lane, lanes - 1]) - 0.5)*3);
	}
	
	aspect base {
		if(showRoad and to_display){
			draw shape color:is_tunnel?rgb(50,0,0):type_colors["car"] width:1;	
		}
	}
}

species bikelane{
	bool from_road <- true;
	int lanes;
	aspect base {
		if(showBikeLane and not from_road){
		  draw shape color: color width:1;	
		}	
	}
}


species bus_line{
	rgb color;
	float capacity;
	float capacity_pca;
	aspect base {
		if(showBusLane){
		  draw shape color: color;	
		}
	}
}

species station schedules: station where (each.type="metro") {
	rgb color;
	string type;
	float capacity;
	float capacity_pca;
	float delay <- rnd(2.0,8.0) #mn ;
	
	//Create people going in and out of metro station
	reflex add_people when: (length(pedestrian) < nbAgent*mobilityRatio["people"]) and every(delay){
		create pedestrian number:rnd(0,10){
			type<-"people";
			location<-any_location_in(myself);
		}
	}
	aspect base {
		if(showStation){
		  if(showMetroLane){
		  	if(type="metro"){
		  	  draw circle(20) - circle(16) color:#blue;	
		  	  draw circle(16) color:#white;	
		  	}
		  }
		  if(showBusLane){
		  	if(type="bus"){
		  	  draw circle(20) - circle(16) color:#yellow;	
		  	  draw circle(16) color:#white;		
		  	}
		  }
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
		if(showMetroLane){
		  draw shape color: metro_colors[number] width:3;	
		}
		
	}
}


species pedestrian skills:[moving] control: fsm{
	string type;
	agent target_place;
	point target;
	int stroll_time;
	int visiting_time;
	float speed_walk <- rnd(3,6) #km/#h;
	bool to_exit <- false;
	float proba_sortie <- 0.3;
	float proba_wandering <- 0.5;
	float proba_culture <- 0.7;
	float offset <- rnd(0.0,2.0);
	
	bool wandering <- false;
	bool to_culture <- false;
	bool visiting <- false;
	bool ready_to_visit <- false;
	bool walking <- false;
	float val_f ;
	list<point> current_trajectory;
	
	action updatefuzzTrajectory{
		if(showPeopleTrajectory){
			float val_pt <- val_f + rnd(-fuzzyness, fuzzyness);
		  	point pt <- location + {cos(heading + 90) * val_pt, sin(heading + 90) * val_pt};  
		    loop while:(length(current_trajectory) > trajectoryLength)
	  	    {
	        current_trajectory >> first(current_trajectory);
	        }
	        current_trajectory << pt;	
		}
	}
	state walk_to_objective initial: true{
		enter {
			walking <- true;
			wandering <- false;
			to_culture <- false;
			float speed_walk_current <- speed_walk;
			if flip(proba_sortie) {
				target <- (station where (each.type="metro") closest_to self).location;
				to_exit <- true;
			} else {
				if flip(proba_wandering) {
					target <- any_location_in(agent(one_of(people_graph.edges)));
					wandering <- true;
					speed_walk_current <- speed_walk_current/ 3.0;
				} else {
					if flip(proba_culture) {
						target_place <- proba_choose_culture.keys[rnd_choice(proba_choose_culture.values)];
						to_culture <- true;
						target <- first(culture(target_place).positions);
					} else {
						target_place <- proba_choose_park.keys[rnd_choice(proba_choose_park.values)];
						target <- (target_place closest_points_with self) [0] ;
					}
				}
			}
		}
		do goto target: target on:people_graph speed: speed_walk_current;
		transition to: stroll_in_city when: not to_exit and wandering and location = target;
		transition to: stroll_in_park when: not to_exit and not wandering and not to_culture and location = target;
		transition to: queueing when: not to_exit and to_culture and location = target;
		transition to: outside_sim when:to_exit and location = target;
		do updatefuzzTrajectory;		
		exit {
			walking <- false;
		}	
	}
	
	
	state stroll_in_city {
		enter {
			stroll_time <- rnd(1, 10) *60;
		}
		stroll_time <- stroll_time - 1;
		do wander amplitude:10.0 speed:2.0#km/#h;
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: stroll_time = 0;
	}
	
	
	state stroll_in_park {
		enter {
			stroll_time <- rnd(1, 10) * 60;
		}
		stroll_time <- stroll_time - 1;
		do wander bounds:target_place amplitude:10.0 speed:2.0#km/#h;
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: stroll_time = 0;
	}
	
	state outside_sim {
		do updatefuzzTrajectory;
		do die;
	}
	
	//ce mot existe ?
	state queueing {
		enter {
			ask culture(target_place) {
				do add_people(myself);
			}
		}
		transition to: visiting_place when: ready_to_visit;
		do updatefuzzTrajectory;
		exit {
			visiting <- false;
			ready_to_visit <- false;
		}
	}
	
	state visiting_place {
		enter {
			visiting <- true;
			visiting_time <- rnd(1,10) * 60;
		}
		visiting_time <- visiting_time - 1;
		do wander bounds:target_place amplitude:10.0 speed:0.5#km/#h;
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: visiting_time = 0;
		exit {
			visiting <- false;
		}
	}
	
	point calcul_loc {
		if (current_edge = nil) {
			return location;
		} else {
			float val <- (road(current_edge).lanes +1)*3 +offset;
			if (val = 0) {
				return location;
			} else {
				return (location + {cos(heading + 90) * val, sin(heading + 90) * val});
			}
		}
	} 
	
	aspect base{
		if(showPedestrian){
			 draw square(2#m) color:type_colors[type] at:walking ? calcul_loc() :location rotate: angle;	
		}
		if(showPeopleTrajectory){
	       draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,0.2);	
	  	}	
	}
}

species bike skills:[moving]{
	string type;
	point my_target;
	list<point> current_trajectory;
	
	reflex choose_target when: my_target = nil {
		my_target <- any_location_in(one_of(bikelane));
	}
	reflex move{
	  do goto on: bike_graph target: my_target speed: 8#km/#h move_weights:weights_bikelane ;
	  if (my_target = location) {my_target <- nil;}
	  loop while:(length(current_trajectory) > trajectoryLength)
  	    {
        current_trajectory >> first(current_trajectory);
        }
        current_trajectory << location;
	}
	aspect base{
		if(showBike){
		 draw square(2#m) color:type_colors[type] rotate: angle;	
		}	
		if(showBikeTrajectory){
	       draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,0.2);	
	  }
	}
}


species car skills:[advanced_driving]{	
	bool to_update <- false;
	bool test_car <- false;
	int fade_count <- 0;
	point current_offset <- {0,0};
	rgb color;
	point target;
	intersection target_intersection;
	string nationality;
	string profile;
	string aspect;
	string type;
	float speed;
	bool in_tunnel -> current_road != nil and road(current_road).is_tunnel;
	list<point> current_trajectory;
	intersection current_intersection;
	

	bool use_blocked_road {
		if currentSimuState = 0 {return false;}
		if (current_path = nil) {return false;}
		loop rd over:current_path.edges {
			if road(rd).pro_lanes = 0 {
				return true;
			}
		}
		return false;
		
	}
	reflex leave when: final_target = nil  {
		bool ok <- false;
		if (fade_count > 0) {fade_count <- fade_count - 1;}
		if (fade_count = 0) {
			loop while: not ok {
				if (target_intersection != nil and target_intersection in output_intersections) {
					if current_road != nil {
						ask current_road as road {
							do unregister(myself);
						}
					}
					current_intersection <- one_of(input_intersections);
					location <-current_intersection.location;
				}
				target_intersection <- one_of(possible_targets);
				current_lane <- 0;
				current_path <- compute_path(graph: driving_road_network, target: target_intersection);
				
				ok <- current_path != nil and not(use_blocked_road());
			}
		 }
	}
	
	
	reflex move when: final_target != nil{	
	  	do drive;	
	  	loop while:(length(current_trajectory) > trajectoryLength)
  	    {
        current_trajectory >> first(current_trajectory);
        }
        current_trajectory << location+current_offset;
	}
	

	
	/*action update{
		fade_count <- 15;
		if current_road != nil{
			if !road(current_road).to_display 
			{
				fade_count <- 15;
//				ask current_road as road {
//					do unregister(myself);
//				}
//				current_intersection <- one_of(intersection - output_intersections);
//				location <-current_intersection.location;
//				target_intersection <- one_of(possible_targets);
//				current_lane <- 0;
			}else{
				current_path <- compute_path(graph: driving_road_network, target: target_intersection);
			}
			to_update <- false;
		}
//		write "car "+int(self);
	}*/
	
	/*reflex fade when: (fade_count > 0){
		fade_count <- fade_count - 1;
		if fade_count = 0{
			if current_road != nil{
				ask current_road as road {
					do unregister(myself);
				}
			}
			current_intersection <- one_of(intersection - output_intersections);
			location <-current_intersection.location;
			target_intersection <- one_of(possible_targets);
			current_lane <- 0;
			current_path <- compute_path(graph: driving_road_network, target: target_intersection);
			
		}	
	}*/
	
	point calcul_loc {
		if (current_road = nil) {
			return location;
		} else {
			if smoothTrajectory{
				current_offset  <- current_offset + (compute_offset(3) - current_offset) * min([1,real_speed/100*step]);
			}else{
				float val <- road(current_road).compute_offset(current_lane);
				val <- on_linked_road ? -val : val;
				current_offset <- road(current_road).vec_ref[segment_index_on_road][1] * val;
			}			
			return (location + current_offset);
		}
	} 
	
	
	aspect base {
		if(showCar){
		    draw rectangle(2.5#m,5#m) at: calcul_loc() rotate:heading-90 color:in_tunnel?rgb(50,0,0):rgb(type_colors[type],(fade_count=0)?1:fade_count/20);	   
	  	}
	  	if (test_car){
	  		draw rectangle(2.5#m,5#m) at: calcul_loc() rotate:heading-90 color:#green;
	  		loop p over: targets{
	  			draw circle(0.5#m) at: p color: #green; 
	  		}
	  	}
	  	if(showCarTrajectory){
	       draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,0.2);	
	  	}
	}	
	
	
	point compute_offset(int s){
		if current_road = nil or current_path = nil{
			return current_offset;
		}else{
			int ci <- current_index;
			int cs <- segment_index_on_road;
			list<list<point>> segment_list <- [];
			list<road> lr <- [];
			list<list<point>> tmp_vec_ref <- [];
			int count <- 0;
			loop while: (count < s) and ci < length(current_path.edges){
				segment_list << copy_between(road(current_path.edges[ci]).shape.points,cs,cs+2);
				tmp_vec_ref << road(current_path.edges[ci]).vec_ref[cs];
				lr << road(current_path.edges[ci]);
				count <- count + 1;
				cs <- cs + 1;
				if (cs > length(road(current_path.edges[ci]).shape.points)-2){
					cs <- 0;
					ci <- ci + 1;
				}
			}
			list<point> offset_list <- [tmp_vec_ref[0][1]*lr[0].compute_offset(current_lane)];
			list<float> weight_list <- [1.0];
			loop i from: 0 to: length(segment_list) - 2 step: 1{		
				float a <- angle_between(last(segment_list[i]),first(segment_list[i]),last(segment_list[i+1]));
				if !is_number(a){//probleme de precision avec angle_between qui renvoie un #nan
					a <- 180.0;
				}
				weight_list << 1+abs(a-180);
				if abs(abs(a-90)-90)<5{
					offset_list << tmp_vec_ref[i][1]*lr[i].compute_offset(current_lane);
				}else{
					offset_list << (tmp_vec_ref[i][0]*lr[i+1].compute_offset(current_lane)-tmp_vec_ref[i+1][0]*lr[i].compute_offset(current_lane))/sin(a);
				}
			}
			if (test_car){
				loop i from: 0 to: length(segment_list) - 2 step: 1{
					draw circle(1#m) at: last(segment_list[i]) color: rgb(255 - i *100,255 - i*100,255); 
					draw circle(0.5#m) at:  last(segment_list[i])+offset_list[i+1] color: rgb(255 - i *100,255 - i*100,255); 
				}	
			}
			point offset <- {0,0};
			loop i from: 0 to: length(offset_list)-1{
				offset <- offset + offset_list[i]*weight_list[i];
			}
			// ne pas effacer ce qui suit, peut servir pour des tests et ameliorer le smooth 
//			if norm(offset/sum(weight_list)) > 100 {
//				write "car: "+int(self)+ " "+ norm(offset/sum(weight_list))+" offset "+ offset/sum(weight_list);//+" angle "+a;
//				write "offset list "+offset_list;
//				write "angles "+angles;
//				write angles accumulate (abs(abs(a-90)-90));
//				loop i from: 0 to: length(offset_list)-1{
//					write "offset "+i+": "+tmp_vec_ref[i][1]*lr[i].compute_offset(current_lane);
//				}
////				write "vec_ref "+tmp_vec_ref[i][0]+"/"+tmp_vec_ref[i+1][0]+" "+lr[i].compute_offset(current_lane)+"/"+lr[i+1].compute_offset(current_lane);
////				write tmp_vec_ref[i][0]*lr[i+1].compute_offset(current_lane);
////				write tmp_vec_ref[i+1][0]*lr[i].compute_offset(current_lane);
////				write sin(a);
////				write tmp_offset;
//				ask world {do pause;}
//			}
			return offset / sum(weight_list);
		}
	}
}

species graphicWorld{
	aspect base{
		if(showBackground){
		  draw shape texture:backGrounds[currentBackGround].path;	
		}
	}
}

species intervention{
	bool isActive;
	int interventionNumber;
	int id;
	string type;
	string gifFile;
	float h;
	float w;
	bool fit_to_shape <- true;
	action initialize {
		geometry s <- shape rotated_by (-angle);
		w <- s.width ;
		h <- s.height;
		if not(fit_to_shape) {
			geometry env <- envelope(gif_file(gifFile));
			float coeff_img <- env.width / env.height;
			float coeff_shap <- s.width / s.height;
			if (coeff_img > coeff_shap ) {
				h <- w / coeff_img;
			} 
			else if (coeff_img < coeff_shap ){
				w <- h * coeff_img;
			}
		}
		
			
	}
	aspect base {
		if(showIntervention){
			draw shape empty:true color:#white;		
			if(showGif and isActive){
			  draw gif_file(gifFile) size:{w,h} rotate:angle;	
			}
		}
			
		}
}

species signals_zone{
		aspect base {
			draw shape empty: true  color:#green;		
		}
}

species intersection skills: [skill_road_node] {
	int phase;
	bool is_traffic_signal;
	bool is_crossing;
	int group;
	int id;
	int time_to_change <- 20;


	int counter <- rnd(time_to_change);
	list<road> ways1;
	list<road> ways2;
	bool is_green;
	rgb color_fire;
	rgb color_group;
	bool active <- true;

	action compute_crossing(float ref_angle) {
		loop rd over: roads_in {
				list<point> pts2 <- road(rd).shape.points;
				float angle_dest <- float(last(pts2) direction_to rd.location);
				float ang <- abs(angle_dest - ref_angle);
				if (ang > 45 and ang < 135) or (ang > 225 and ang < 315) {
					ways2 << road(rd);
				}

			}
		loop rd over: roads_in {
			if not (rd in ways2) {
				ways1 << road(rd);
			}

		}

	}

	action to_green {
		stop[0] <- ways2;
		color_fire <- #green;
		is_green <- true;
	}

	action to_red {
		stop[0] <- ways1;
		color_fire <- #red;
		is_green <- false;
	}

	reflex dynamic_node when: active and is_traffic_signal {
		counter <- counter + 1;
		if (counter >= time_to_change) {
			counter <- 0;
			if is_green {
				do to_red;
			} else {
				do to_green;
			}

		}

	}

	aspect default {
		if (active and is_traffic_signal and showTrafficSignal) {
			draw circle(5) color: color_fire;
			//draw triangle(5) color: color_group border: #black;
		}
	}
}

species coldSpot{
		aspect base {
			if(showHotSpot){
			  draw shape color:rgb(0,0,0,200);	
			}	
		}
}

experiment ReChamp type: gui autorun:true{
	float minimum_cycle_duration<-0.025;	
	output {
		display champ type:opengl background:#black draw_env:false fullscreen:1  rotate:angle toolbar:false autosave:false synchronized:true
	   	camera_pos: {1770.4355,1602.6887,2837.8093} camera_look_pos: {1770.4355,1602.6392,-0.0014} camera_up_vector: {0.0,1.0,0.0}
	   	{
	   	    species graphicWorld aspect:base position:{0,0,0};	    	
	    	species intervention aspect: base position:{0,0,0};
		    species building aspect: base;
			species park aspect: base ;
			species culture aspect: base ;
			species water aspect: base;
			species road aspect: base;
			species vizuRoad aspect:base transparency:0.5;
			species bus_line aspect: base;
			species metro_line aspect: base;
			species amenities aspect:base;
			species intersection;
			species car aspect:base;
			species pedestrian aspect:base;
			//species metropolitan aspect:base;
			species bike aspect:base;
			//species stroller aspect:base;
			species coldSpot aspect:base;
			species station aspect: base;
			species bikelane aspect:base;
	//		species signals_zone aspect: base;
									
			graphics 'tablebackground'{
				draw geometry(shape_file_bounds) color:#white empty:true;
				draw string("State: " + currentSimuState) rotate:angle at:{400,400} color:#white empty:true;
			}
			
			event["p"] action: {showPedestrian<-!showPedestrian;};
			event["c"] action: {showCar<-!showCar;};
			event["b"] action: {showBike<-!showBike;};
			event["g"] action: {showGif<-!showGif;};
			event["l"] action: {showBuilding<-!showBuilding;};
			event["r"] action: {showRoad<-!showRoad;};
			event["m"] action: {showVizuRoad<-!showVizuRoad;};
			event["v"] action: {showBikeLane<-!showBikeLane;};
			event["i"] action: {showIntervention<-!showIntervention;};
			event["q"] action: {showMetroLane<-!showMetroLane;};
			event["j"] action: {showBusLane<-!showBusLane;};
			event["s"] action: {showStation<-!showStation;};
			event["a"] action: {showAmenities<-!showAmenities;};
			event["n"] action: {showGreen<-!showGreen;};
			event["u"] action: {showUsage<-!showUsage;};
			event["w"] action: {showWater<-!showWater;};
			event["h"] action: {showHotSpot<-!showHotSpot;};
			event["f"] action: {showTrafficSignal<-!showTrafficSignal;};
			//event[" "] action: {showBackground<-!showBackground;};				
			event["z"] action: {currentSimuState <- (currentSimuState + 1) mod 2;updateSim<-true;};
			//event["1"] action: {if(currentSimuState!=1){currentSimuState<-1;updateSim<-true;}};
		}
	}
}

