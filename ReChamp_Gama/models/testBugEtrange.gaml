  /***
* Name: ReChamp
* Author: Arnaud Grignard, Tri Nguyen-Huu, Patrick Taillandier, Nicolas Ayoub 
* Description: ReChamp - 2020 - CityScope Champs Elysées - Pavillon de l'Arsenal
* Tags: Tag1, Tag2, TagN
***/

model ReChamp

global {//schedules:  station + road + intersection + culture + car + bus + bike +	pedestrian {
	//EXISTING SHAPEFILE (FROM OPENDATA and OPENSTREETMAP)
	file shape_file_bounds <- file("../includes/GIS/TableBounds.shp");
	file buildings_shapefile <- file("../includes/GIS/buildings.shp");
	
	file roads_shapefile <- file("../includes/GIS/roads_OSM.shp");
	file nodes_shapefile <- file("../includes/GIS/nodes_OSM.shp");
	file signals_zone_shapefile <- file("../includes/GIS/signals_zone.shp");
	
	file bus_shapefile <- file("../includes/GIS/lignes_bus.shp");
	file station_shapefile <- file("../includes/GIS/stations_metro_simple.shp");
	file bikelane_shapefile <- file("../includes/GIS/reseau-cyclable_reconnected.shp");
	
	file origin_destination_shapefile <- shape_file("../includes/GIS/origin_destination_line.shp");

	//GENERATED SHAPEFILE (FROM QGIS)
	//INTERVENTION
	file coldspot_shapefile <- file("../includes/GIS/Coldspot.shp");		
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
	list<graph> people_graph;
	graph bike_graph;
	graph bus_graph;
	
	list<graph> driving_road_network;
	
	float max_dev <- 10.0;
	float fuzzyness <- 1.0;
	float dist_group_traffic_light <- 50.0;

	
	bool showCar parameter: 'Car (c)' category: "Agent" <-true;
	bool showPeople parameter: 'Pedestrain (p)' category: "Agent" <-true;
	bool showBike parameter: 'Bike (v)' category: "Agent" <-true;
	bool showSharedMobility parameter: 'Shared Mobility (b)' category: "Agent" <-true;
	

	bool showVizuRoad parameter: 'Mobility(m)' category: "Infrastructure" <-false;
	bool showNature parameter: 'Nature (n)' category: "Infrastructure" <-true;
	bool showUsage parameter: 'Usage (u)' category: "Infrastructure" <-true;

	bool showPeopleTrajectory parameter: 'People Trajectory' category: "Trajectory" <-false;
	bool showCarTrajectory parameter: 'Car Trajectory' category: "Trajectory" <-true;
	bool showBikeTrajectory parameter: 'Bike Trajectory' category: "Trajectory" <-true;
	bool showSharedMobilityTrajectory parameter: 'SharedMobility Trajectory' category: "Trajectory" <-true;
	
	int trajectorySizeMax<-100;
	int peopleTrajectoryLength <-50 parameter: 'People Trajectory length' category: "Trajectory" min: 0 max:100;
	int carTrajectoryLength <-20 parameter: 'Car Trajectory length' category: "Trajectory" min: 0 max: 100;
	int bikeTrajectory <-50 parameter: 'Bike Trajectory' category: "Trajectory" min: 0 max: 100;
	int busTrajectoryLength<-50 parameter: 'Bus Trajectory' category: "Trajectory" min: 0 max: 100;

	

	bool applyFuzzyness parameter: 'fuzzyNess' category: "People" <-true;

	float step <-2.5#sec parameter: 'Simulation Step' category: "Simulation" min: 0.1#sec max: 1000#sec;
	float traffic_light_duration <-70#sec parameter: 'Traffic light duration' category: "Simulation" min: 1#sec max: 300#sec;
	float speedUpSpeedMax <-50#sec parameter: 'Speedup Max' category: "SpeedUp" min: 1#sec max:200#sec;
	float speedUpSpeedMin <-2.5#sec parameter: 'Speedup Min' category: "SpeedUp" min: 0.1#sec max: 20#sec;
	float speedUpSpeedDecrease <-2#sec parameter: 'Speedup Decrement' category: "SpeedUp" min: 1#sec max: 20#sec;
	
	bool speedUpSim parameter: 'speedUpSim' category: "SpeedUp" <-true;
	

	bool smoothTrajectory parameter: 'Smooth Trajectory' category: "Trajectory" <-true;
	bool new_trail parameter: 'New trail drawing' category: "Trajectory" <-true;
	float peopleTrajectoryTransparency <-0.5 parameter: 'People Trajectory transparency ' category: "Trajectory Transparency" min: 0.0 max: 1.0;
	float carTrajectoryTransparency <-0.5 parameter: 'Car Trajectory transparency Before' category: "Trajectory Transparency" min: 0.0 max: 1.0;
	float bikeTrajectoryTransparency <-0.5 parameter: 'Bike Trajectory transparency Before' category: "Trajectory Transparency" min: 0.0 max: 1.0;
	float busTrajectoryTransparency <-0.5 parameter: 'Bus Trajectory transparency Before' category: "Trajectory Transparency" min: 0.0 max: 1.0;

	
	bool showBikeLane  parameter: 'Bike Lane' category: "Parameters" <-false;
	bool showBusLane parameter: 'Bus Lane' category: "Parameters" <-false;
	bool showStation parameter: 'Station' category: "Parameters" <-false;
	bool showTrafficSignal parameter: 'Traffic signal (t)' category: "Parameters" <-false;
	bool showBuilding parameter: 'Building (l)' category: "Parameters" <-false;
	bool showRoad parameter: 'Road (r)' category: "Parameters" <-false;
	
	bool showWaitingLine parameter: 'Waiting Line (x)' category: "Parameters" <-false;
	bool showIntervention parameter: 'Intervention (i)' category: "Parameters" <-false;
	bool showBackground <- false parameter: "Background (Space)" category: "Parameters";
	float factor<-0.8;

	float peopleSize <-(3.0)#m parameter: 'People size' category: "Parameters" min: 0.5#m max: 5.0#m;
	float carSize <-(3.0)#m parameter: 'Car size' category: "Parameters" min: 0.5#m max: 5.0#m;
	float bikeSize <-(1.66)#m parameter: 'Bike size' category: "Parameters" min: 0.5#m max: 5.0#m;
	float busSize <-(2.0)#m parameter: 'Bus size' category: "Parameters" min: 0.5#m max: 5.0#m;

	bool showPedBlock parameter: 'Show Pedestrian Blocking' category: "Debug" <-true;
	bool showTestCar parameter: 'test Car' category: "Debug" <-false;
	bool drawLegend parameter: 'Legend' category: "Debug (l)" <-false;
	
	bool oneButtonInterface parameter: 'Interface' category: "Interface" <-false;
	

	
	
	bool showHotSpot  parameter: 'HotSpot (h)' category: "Parameters" <-false;
	int currentBackGround <-0;
	list<file> backGrounds <- [file('../includes/PNG/PCA_REF.png'),file('../includes/PNG/PCA_REF.png')];
	file dashboardbackground_before <- file('../includes/PNG/radar_plot/radar_plot.001.jpeg');
	file dashboardbackground_after <- file('../includes/PNG/radar_plot/radar_plot.002.jpeg');
    
    list<file> radarPlots <- [file('../includes/PNG/radar_plot/radar_plot.003.jpeg'),file('../includes/PNG/radar_plot/radar_plot.004.jpeg'),file('../includes/PNG/radar_plot/radar_plot.005.jpeg'),file('../includes/PNG/radar_plot/radar_plot.006.jpeg'),file('../includes/PNG/radar_plot/radar_plot.007.jpeg'),file('../includes/PNG/radar_plot/radar_plot.008.jpeg')];
    
    
	bool right_side_driving <- true;
	
	map<string, rgb> metro_colors <- ["1"::rgb("#FFCD00"), "2"::rgb("#003CA6"),"3"::rgb("#837902"), "6"::rgb("#E2231A"),"7"::rgb("#FA9ABA"),"8"::rgb("#E19BDF"),"9"::rgb("#B6BD00"),"12"::rgb("#007852"),"13"::rgb("#6EC4E8"),"14"::rgb("#62259D")];
	//OLD PCA
	//map<string, rgb> type_colors <- ["default"::#white,"people"::#yellow, "car"::rgb(204,0,106),"bike"::rgb(18,145,209), "bus"::rgb(131,191,98)];
	//NEW COLOR
	map<string, rgb> type_colors <- ["default"::#white,"people"::#white, "car"::rgb(255,0,0),"bike"::rgb(18,145,209), "bus"::rgb(131,191,98)];
	
	map<string, rgb> voirie_colors <- ["Piste"::#white,"Couloir Bus"::#green, "Couloir mixte bus-vélo"::#red,"Piste cyclable"::#blue];
	map<string, rgb> nature_colors <- ["exi"::rgb(140,200,135),"pro"::rgb(140,200,135)];
	map<string, rgb> usage_colors <- ["exi"::rgb(175,175,175),"pro"::rgb(175,175,175)];
	
	float angle<-26.25;

	int stateNumber <- 2;
	string currentSimuState_str <- "present" among: ["present", "future"];
	int currentSimuState<-0;
	int currentStoryTellingState<-0;
	list<string> catchPhrase<-["car traffic","moblilité douce","park","culture"];
	bool updateSim<-true;
	int nbAgent<-750;
	
	map<string,float> mobilityRatioNow <-["people"::0.3, "car"::0.6,"bike"::0.1, "bus"::0];
	map<string,float> mobilityRatioFuture <-["people"::1.2, "car"::0.3,"bike"::0.15, "bus"::0.05];

	
	map<bikelane,float> weights_bikelane;
	list<list<intersection>> input_intersections <-list_with(stateNumber, []);
	list<list<intersection>> output_intersections <-list_with(stateNumber, []);
	list<list<intersection>> possible_targets <-list_with(stateNumber, []);
	list<list<intersection>> possible_sources <-list_with(stateNumber, []);
	list<map<int,int>> od_weights <- list_with(stateNumber, nil);
	list<map<int,intersection>> od_origins <- list_with(stateNumber, nil);
	list<map<int,intersection>> od_destinations <-list_with(stateNumber, nil);
	list<map<int,path>> od_paths <- list_with(stateNumber, nil);
	
	map<agent,float> proba_choose_park;
	map<agent,float> proba_choose_culture;
	
	list<park> activated_parks;
	list<culture> activated_cultures;
	
	int chrono_size <- 30;
	bool fps_monitor parameter: 'Show fps' category: "Simu" <-false;
	float m_time <- 0.0;
	list<float> chrono <- [];
	
	float meanSpeedCar<-15 #km/#h;
	float deviationSpeedCar<-10 #km/#h;
	
	float minSpeedPeople<-2 #km/#h;
	float maxSpeedPeople<-5 #km/#h;
	
	float proba_hot_target <- 0.9; //proba to choose a hot target for bikes.
	float proba_used_od <-0.7;
	float factor_avoid_tj <- 2.0;
	float proba_avoid_tj <- 0.5;
	map<int,list<road>> blocked_roads;
	list<map<list<list<road>>>> ped_blocking_roads <- list_with(stateNumber, nil);//indices: simuState, groupe, phase;
	map<int,int> phase_per_group;
	
	point source;
	point destination;
	path shortest_path;
	bool test_path <- false;
	int crossOverTime<-10;
	int crossOverCar;
	int crossOverSoftMob;
	int crossOverNature;
	int crossOverUsage;
	
	list<bikelane> hot_bike_lanes;

	float t_re_init <- machine_time;	
	
	float time_between_clean <- 2 * (60.0 * 60 * 1000);
	
	reflex reset_simulation when: (machine_time - t_re_init) >  time_between_clean{
		t_re_init <- machine_time;
		write "CLEAN";
		ask car {
			do remove_and_die;
		} 
		ask road where (each.lanes > 0){
			loop i from: 0 to:length(agents_on) -1{
				loop  j from: 0 to:length(agents_on[i]) -1 {
					agents_on[i][j] <- [];
				}
				 
			}
			all_agents <- [];
		}
		ask bus {
			do die;
		}
		ask bike {
			do die;
		}
		ask culture {
			people_waiting <- [];
			waiting_tourists <- [];
		}
		ask pedestrian {
			do die;
		}
		ask experiment {do compact_memory;}
		do init_agents;
	}
	
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
				if (p = nil) {p <- park first_with (each.location = g.location);}
				if (p != nil){p.state << "present";}
			}
		}
		create culture from: Usage_Future_shapefile where (each != nil) with: [type:string(read ("type")),style:string(read ("style")),capacity:float(read ("capacity"))]{
			state<<"future";
			if (shape = nil or shape.area = 0) {
				do die;
			}
		}
		loop g over: Usage_Now_shapefile where (each != nil and each.area > 0) {
			culture p <- (culture first_with(each.shape.area = g.area));
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
		create road from: roads_shapefile with: [ped_way::[int(read("p_before")),int(read("p_after"))], lanes_nb::[int(read("lanes")),int(read("pro_lanes"))], oneway::string(read("oneway")), sidewalk_size::float(read("sideoffset")), is_tunnel::[(read("tunnel")="yes"?true:false),(read("pro_tunnel")="yes"?true:false)]] {
			maxspeed <- (lanes = 1 ? 30.0 : (lanes = 2 ? 40.0 : 50.0)) °km / °h;
			lanes <- lanes_nb[currentSimuState];
			switch oneway {
				match "no" {
					create road {
						lanes <- myself.lanes;
						lanes_nb <- myself.lanes_nb;
						shape <- polyline(reverse(myself.shape.points));
						maxspeed <- myself.maxspeed;
						is_tunnel <- myself.is_tunnel;
						oneway <- myself.oneway;
						sidewalk_size<-myself.sidewalk_size;
						ped_way <- [0,0];
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
			offset_list <- list_with(stateNumber,nil);
			loop j from: 0 to:  stateNumber-1{
				loop i from: 0 to: lanes_nb[j] -1 step: 1 {
					offset_list[j] << (oneway='no')?((lanes_nb[j] - i - 0.5)*3 + 0.25):((0.5*lanes_nb[j] - i - 0.5)*3);
				}
			}
			loop i from: 0 to: length(shape.points) - 3 step: 1{		
				float a <- angle_between(shape.points[i+1],shape.points[i],shape.points[i+2]);
				if !is_number(a){//probleme de precision avec angle_between qui renvoie un #nan
					a <- 180.0;
				}
				angles << a;
			}
			
		}
		
		//creation of the road network using the road and intersection agents
		graph tmp <- as_driving_graph(road, intersection) use_cache false;
		loop j from: 0 to:  stateNumber-1{
			people_graph << as_edge_graph(road where (each.ped_way[j] != 0)) use_cache false;
		}
		
		ask intersection where each.is_traffic_signal{
			if empty(signals_zone overlapping self){
				is_traffic_signal <- false;
			}
		}
		
		loop j from: 0 to:  stateNumber-1{
			map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 50) * (each.shape.perimeter / each.maxspeed)/(0.1+each.lanes_nb[j])^2));
			driving_road_network << (as_driving_graph(road where (each.lanes_nb[j] > 0), intersection)) with_weights general_speed_map use_cache false with_optimizer_type "NBAStarApprox";
		}
		
		do init_traffic_signal;
		loop j from: 0 to: stateNumber - 1{
			ask intersection where each.is_traffic_signal {
				activityStates[j] <- (roads_in first_with (road(each).lanes_nb[j] > 0) != nil);	
			}
		}
		
		loop j from: 0 to:  stateNumber-1{
			ask intersection{
				self.reachable_by_all[j] <- false;
				self.can_reach_all[j] <- false;
			}

			list<list<intersection>> il <- find_connection(intersection[4], j);
			ask il[0]{
				self.reachable_by_all[j] <- true;
			}
			ask il[1]{
				self.can_reach_all[j] <- true;
			}	
		}

		loop j from: 0 to: stateNumber - 1{
			loop i over: intersection{
				if not(i.can_reach_all[j]) {output_intersections[j] << i;}
				if not(i.reachable_by_all[j]){input_intersections[j] << i;}
			}
			possible_targets[j] <- intersection - input_intersections[j];
			possible_sources[j] <- intersection - output_intersections[j];		
		}	
		
		loop j from: 0 to: stateNumber - 1{
			int index <- 0;
			loop pt over: origin_destination_shapefile.contents {
				int weight <- int(pt.attributes['capacity']);
				intersection i <- possible_sources[j] closest_to first(pt.points);
				intersection o <- possible_targets[j] closest_to last(pt.points);
				od_weights[j] << index::weight;
				od_origins[j] << index::i;
				od_destinations[j] << index::o;
				index <- index + 1;	
			} 
		}
		
		// precompute paths with Dijkstra
		create car returns: dummy_car;
		path p;
		loop j from: 0 to: stateNumber - 1{
			map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 50) * (each.shape.perimeter / each.maxspeed)/(0.1+each.lanes_nb[j])^2));
			graph tmp <- (as_driving_graph(road where (each.lanes_nb[j] > 0), intersection)) with_weights general_speed_map use_cache false with_optimizer_type "Dijkstra";
			loop od over: od_weights[j].keys {//♣	
				ask first(dummy_car){
					self.location <- od_origins[j][od].location;
					target_intersection <- od_destinations[j][od];
					p <- compute_path(graph: tmp, target: target_intersection);
					ask current_road as road {
						do unregister(myself);
					}
				}
				od_paths[j] << od::p;
			} 
		}
		ask first(dummy_car) {do die;}
		
		
		loop i over: intersection{
			i.roads_in <- remove_duplicates(i.roads_in);
			i.roads_out <- remove_duplicates(i.roads_out);
		}
		

		
		loop j from: 0 to: stateNumber - 1{
			loop i over: intersection where not(each.can_reach_all[j]) {
				if empty(i.roads_out where (road(each).lanes_nb[j] != 0)){
					i.exit[j] <- i;
				}else{
					road o <- one_of(i.roads_out) as road;
					intersection i2 <- one_of(intersection where (each.roads_in contains o));
					if i2.exit[j] = nil{
						i.exit[j] <- i2;
					}else{
						i.exit[j] <- i2.exit[j];
					}
					ask intersection where(each.exit[j] = i){
						exit[j] <- i.exit[j];
					}
				}
			}
			possible_targets[j] <- intersection - input_intersections[j];
		}	

	//	do check_signals_integrity;
		
		create station from: station_shapefile with: [type:string(read ("type")), capacity:int(read ("capacity"))];
		create coldSpot from:coldspot_shapefile;
		
		//------------------- NETWORK -------------------------------------- //
		create bikelane from:bikelane_shapefile{
			color<-type_colors["bike"];
		}
		ask coldSpot {
			ask bikelane overlapping self {
				is_cold_spot <- true;
			}
		}
		hot_bike_lanes <- bikelane where not each.is_cold_spot;
		create bus_line from: bus_shapefile{
			color<-type_colors["bus"];
		}
		
		//------------------- AGENT ---------------------------------------- //
		
		do updateSimuState;
		
		do init_agents;
		
		weights_bikelane <- bikelane as_map(each::each.shape.perimeter);
		map<bikelane,float> weights_bikelane_sp <- bikelane as_map(each::each.shape.perimeter * (each.from_road ? 10.0 : 0.0));
		
		bike_graph <- (as_edge_graph(bikelane) with_weights weights_bikelane_sp) use_cache false;
		//bike_graph<- bike_graph use_cache false;
		
		bus_graph <- (as_edge_graph(road)) use_cache false;
		//bus_graph<- bus_graph use_cache false;
		
			//Graphical Species (gif loader)
		create graphicWorld from:shape_file_bounds;
		

//		map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 10) *(each.shape.perimeter / each.maxspeed) / (1+each.lanes)));
//		driving_road_network <- driving_road_network with_weights general_speed_map; 
	}
	
	
	action init_agents {
		do create_cars(round(nbAgent*world.get_mobility_ratio()["car"]));
		
		
//		ask first(5,car){test_car <- true;}
		
		//Create Pedestrian
		do create_pedestrian(round(nbAgent*world.get_mobility_ratio()["people"]));
		ask one_of(pedestrian){
			show_story <- true;
		}
		
        //Create Bike
	    create bike number:round(nbAgent*world.get_mobility_ratio()["bike"]){
	      type <- "bike";
	      speed<-2+rnd(maxSpeed);
		  location<-any_location_in(one_of(building));	
		  //location<-any_location_in(one_of(origin_destination_shapefile.contents));
		}
	
		 //Create Bus
	    create bus number:round(nbAgent*mobilityRatioNow["bus"]){
	      type <- "bus";
		  location<-any_location_in(one_of(road));	
		}
	}
	action updateStoryTelling (int n){
		    if(n=0){currentStoryTellingState<-0;}
			if(n=1){currentStoryTellingState<-1;showCar<-true;showPeople<-false;showBike<-false;showSharedMobility<-false;showNature<-false;showUsage<-false;crossOverCar<-crossOverTime;}
			if(n=2){currentStoryTellingState<-2;showCar<-false;showPeople<-true;showBike<-true;showSharedMobility<-true;showNature<-false;showUsage<-false;crossOverSoftMob<-crossOverTime;}
			if(n=3){currentStoryTellingState<-3;showCar<-false;showPeople<-true;showBike<-false;showSharedMobility<-false;showNature<-true;showUsage<-false;crossOverNature<-crossOverTime;}
			if(n=4){currentStoryTellingState<-4;showCar<-false;showPeople<-true;showBike<-false;showSharedMobility<-false;showNature<-false;showUsage<-true;crossOverUsage<-crossOverTime;}
	}
	map<string,float> get_mobility_ratio {
		if (currentSimuState = 0) {
			return mobilityRatioNow;
		} else {
			return mobilityRatioFuture;
		}
	}
	
	reflex chrono {
		if length(chrono) > chrono_size{
			chrono >> first(chrono);
		}
		float new_m_time <- machine_time;
		if cycle > 1 {
			chrono << new_m_time - m_time;
		}
		if fps_monitor and cycle mod 5 = 0 and cycle > 0 {
			write "fps: "+round((1/mean(chrono))*10000)/10+"    ("+round(mean(chrono))+"ms per frame)";
			}
		m_time <- new_m_time;
	}
	
	reflex fadein when:(crossOverCar>0 or crossOverSoftMob>0 or crossOverNature>0 or crossOverUsage>0){
		if (crossOverCar>0){crossOverCar<-crossOverCar-1;}
		if (crossOverSoftMob>0){crossOverSoftMob<-crossOverSoftMob-1;}
		if (crossOverNature>0){crossOverNature<-crossOverNature-1;}
		if (crossOverUsage>0){crossOverUsage<-crossOverUsage-1;}
	}
	
	
	action create_pedestrian(int nb) {
		create pedestrian number:nb{
		  current_trajectory <- [];
		  type <- "people";
			if flip(0.3) {
				target_place <- proba_choose_park.keys[rnd_choice(proba_choose_park.values)];
				target <- (any_location_in(target_place));
				location<-copy(target);
				state <- "stroll";
			} else {
				location<-any_location_in(one_of(station where (each.capacity=5)));//capacity 5 = stations on Champs Elysees
			}
			if flip(0.5){
				side<-1;
			}else{
				side<--1;
			}
		  	
		}
	}
	action create_cars(int nb) {
		create car number:nb{
		 	type <- "car";
		  	max_speed <- 160 #km / #h;
		  	speed<-meanSpeedCar + rnd(deviationSpeedCar);
			vehicle_length <- 10.0 #m;
			right_side_driving <- myself.right_side_driving;
			proba_lane_change_up <- 0.1 + (rnd(500) / 500);
			proba_lane_change_down <- 0.5 + (rnd(500) / 500);
			if flip(proba_used_od) {
				current_lane <- 0;
				int od_index <- rnd_choice(od_weights[currentSimuState].values);
				starting_intersection <- od_origins[currentSimuState].values[od_index];
				target_intersection <- od_destinations[currentSimuState].values[od_index];
				location <-starting_intersection.location;
				current_path <- set_path(od_paths[currentSimuState][od_index]);
			} else {
				starting_intersection <- one_of(possible_sources[currentSimuState]);
				location <-starting_intersection.location;
			}
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
			phase_per_group << i::1;
		}
		
		// init traffic lights
		loop i over: (remove_duplicates(traffic_signals collect(each.group)) - 0) {
			list<intersection> gp <- traffic_signals where(each.group = i);
			rgb col <- rnd_color(255);
			float cpt_init <- rnd(traffic_light_duration);
			bool green <- flip(0.5);
			ask gp {
				color_group <- col;
				point centroide <- mean (gp collect each.location);
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
		
//		// init pedestrian crossings
//		list<graph> tmp_car_graph;
//		loop j from: 0 to:  stateNumber-1{
//			tmp_car_graph << as_edge_graph(road where (each.lanes_nb[j] != 0)) use_cache false;
//		}
//		
//		loop i over: (remove_duplicates(traffic_signals collect(each.group)) - 0) {	
//			list<intersection> gp <- traffic_signals where(each.group = i);
//			loop i1 over: gp{
//				list<intersection> i_group <- intersection where (each.group = i and each.phase = i1.phase) - i1;
//				loop i2 over: i_group{
//					int truc <-0; //MARKER FOR UPDATING NEXT LINE
//					path p <- path_between(tmp_car_graph[0],i1,i2);
//			//		path p <- path_between(driving_road_network[0],i1,i2);
//	
////					if i=12{
////						write ""+ i1+" to "+i2+" phase "+i1.phase;
////						write " path "+p.edges;
////					}
//					bool add_next_road <- true; 
//					if i1.location = first(road(first(p.edges)).shape.points) and i2.location = last(road(last(p.edges)).shape.points){// do not add path if the path does not strictly joins the two intersections
//						loop r over: list<road>(p.edges){
//							r.tl_group <- i;
//	//						if int(i1)= 163{
//	//							write r;
//	////							write ""+r.target_node+" "+intersection(r.target_node).phase;
//	////							write ""+r.source_node+" "+intersection(r.source_node).phase;
//	////							write 		(intersection(r.target_node).phase != 0 and intersection(r.target_node).phase != i1.phase) or (intersection(r.source_node).phase != 0 and intersection(r.source_node).phase != i1.phase);
//	//						}
//							
//							if (intersection(r.target_node).phase != 0 and intersection(r.target_node).phase != i1.phase) or (intersection(r.source_node).phase != 0 and intersection(r.source_node).phase != i1.phase){
//								add_next_road <- false;
//							}
//	//						if int(i1) = 163{
//	//							write ""+r+" "+add_next_road;
//	//						}
//							if add_next_road{
//								i1.ped_xing_block <- i1.ped_xing_block + r;
//							}
//						}
//					}
////					if int(i1) = 163{write ""+ i1+" to "+i2+" phase "+i1.phase+" path "+p.edges;}			
//					
//				
//					
//					
//					
//	//				if int(i1) =163{write i1.ped_xing_block;}
//				}
//				i1.ped_xing_block <- remove_duplicates(i1.ped_xing_block);
//			}
//			
//			blocked_roads <<i:: road where(each.tl_group = i);
//			map<int, intersection> m;		
//			loop ph over: remove_duplicates(gp accumulate(each.phase)){
//				intersection i1 <- first(gp where(each.phase=ph));
//				i1.master_intersection <- true;
//				i1.ped_xing_block <- remove_duplicates((gp where(each.phase=ph)) accumulate each.ped_xing_block);
////				list<road> lr <- [];	
////				loop i1 over: gp where(each.phase = ph){
////					lr <- lr + i1.ped_xing_block;
////				}
////				m << ph::lr;
//			}		
//		}

		// init pedestrian crossings
//		phase_per_group <- list_with(length((remove_duplicates(traffic_signals collect(each.group)) - 0)),0);
		graph tmp_car_graph;
		loop j from: 0 to:  stateNumber-1{
			tmp_car_graph <- as_edge_graph(road where (each.lanes_nb[j] != 0)) use_cache false;
			loop i over: (remove_duplicates(traffic_signals collect(each.group)) - 0) {	// loop over traffic signals groups
				list<intersection> gp <- traffic_signals where(each.group = i);
				int nb_phases <- length(remove_duplicates(gp collect(each.phase)));
				list<list<road>> roads_per_phase <- list_with(nb_phases,[]);
				loop i1 over: gp{
					list<intersection> i_group <- intersection where (each.group = i and each.phase = i1.phase) - i1;
					loop i2 over: i_group{
						path p <- path_between(tmp_car_graph,i1,i2);
						bool add_next_road <- true; 
						if i1.location = first(road(first(p.edges)).shape.points) and i2.location = last(road(last(p.edges)).shape.points){// do not add path if the path does not strictly joins the two intersections
							loop r over: list<road>(p.edges){
								r.tl_group <- i;
								if (intersection(r.target_node).phase != 0 and intersection(r.target_node).phase != i1.phase) or (intersection(r.source_node).phase != 0 and intersection(r.source_node).phase != i1.phase){
									add_next_road <- false;
								}
								if add_next_road{
									roads_per_phase[i1.phase-1] << r;
								}
							}
						}
					}
				}
				loop k from: 0 to: length(roads_per_phase)-1{
					roads_per_phase[k] <- remove_duplicates(roads_per_phase[k]);
				}
				put roads_per_phase at: i in: ped_blocking_roads[j];
				map<int, intersection> m;		
				loop ph over: remove_duplicates(gp accumulate(each.phase)){
					intersection i1 <- first(gp where(each.phase=ph));
					i1.master_intersection <- true;
					i1.ped_xing_block <- remove_duplicates((gp where(each.phase=ph)) accumulate each.ped_xing_block);
				}		
			}
		}
		
		list<int> signals_indexes <- (remove_duplicates(traffic_signals collect(each.group)) - 0);
		loop i over: signals_indexes{
			blocked_roads <<i:: road where(each.tl_group = i);
		}
		loop r over: road where(max(each.lanes_nb)=0){
			loop i over: signals_indexes{
				loop r2 over: road where(each.tl_group = i){
					if intersects(r,r2){
						put blocked_roads[i]+r at: i in: blocked_roads;
					}
				}
			}
		}
				

		
		//init traffic lights that are not in main area
		list<list<intersection>> groupes <- traffic_signals where (each.group = 0) simple_clustering_by_distance dist_group_traffic_light;
		loop gp over: groupes {
			rgb col <- rnd_color(255);
			ask gp {color_group <- col;}
			float cpt_init <- rnd(traffic_light_duration);
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
				point centroide <- mean (gp collect each.location);
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
	
	reflex update_driving_graph when: cycle > 0 and every(10 #cycle){
		loop j from: 0 to:  stateNumber-1{
			map general_speed_map <- road as_map (each::((each.hot_spot ? 1 : 50) * (each.shape.perimeter / (max(1,each.mean_speed)) ^factor_avoid_tj)/(0.1+each.lanes_nb[j])^2));
			driving_road_network[j] <- driving_road_network[j] with_weights general_speed_map  with_optimizer_type "NBAStarApprox";
		}
	}
	reflex updateSimuState when:updateSim=true{
		currentSimuState <- (currentSimuState + 1) mod stateNumber;
		do updateSimuState;
	}

	reflex update_cars {
		ask first(100,shuffle(car where(each.to_update))){
			do update;
		}
	}
	

	
//	list<intersection> nodes_for_path (intersection source, intersection target, file ssp){
//		
//		list<intersection> nodes <- [];
//		int id <- source.id;
//		int target_id <- target.id;
//		int cpt <- 0;
//		loop while: id != target_id {
//			nodes << intersection(vertices[id]);
//			id <- int(ssp[target_id, id]);
//			cpt <- cpt +1;
//			if (id = -1 or cpt > 50000) {
//				return list<intersection>([]);
//			}
//		}
//		nodes<<target;
//		return nodes;
//	}
	
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
		if(speedUpSim){
			step<-speedUpSpeedMax;
		}
		if (currentSimuState = 0){currentSimuState_str <- "present";}
		if (currentSimuState = 1){currentSimuState_str <- "future";}
		ask road {do change_number_of_lanes(lanes_nb[currentSimuState]);}
		ask intersection where(each.is_traffic_signal){do change_activity;}
		ask car {self.to_update <- true;}
		updateSim<-false;
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
		//proba_choose_culture <- activated_cultures as_map (each::each.shape.area);
		proba_choose_culture <- activated_cultures as_map (each::each.capacity);

		int nb_cars <- length(car);
		int nb_cars_target <- round(nbAgent * get_mobility_ratio()["car"]);
		if (nb_cars_target > nb_cars) {
			do create_cars(nb_cars_target - nb_cars);
		} else if (nb_cars_target < nb_cars) {
			ask (nb_cars - nb_cars_target) among car {
				do remove_and_die;
			}
		}
		ask road {// ca sert a quoi ?
		  	loop i from: 0 to:length(agents_on) - 1 step: 1{
		  		list<list<agent>> ag_l <- agents_on[i];
				loop j from: 0 to: length(ag_l) - 1  {
					list<agent> ag_s <- ag_l[j];
					ag_s <- list<agent>(ag_s) where (each != nil and not dead(each));
					agents_on[i][j] <- ag_s;
				}
			}
		}
	  	

		int nb_people <- length(pedestrian);
		int nb_people_target <- round(nbAgent * get_mobility_ratio()["people"]);
		//FIXME see issue #59 
		if (nb_people_target > nb_people) {
			do create_pedestrian(nb_people_target - nb_people);
		} else if (nb_people_target < nb_people) {
			ask (nb_people - nb_people_target) among pedestrian {
				do die;
			}
		}

		ask pedestrian where (each.state = "stroll_in_city"){
			do reinit_path;
		}	
		
		int nb_bikes <- length(bike);
		int nb_bikes_target <- round(nbAgent * get_mobility_ratio()["bike"]);
		if (nb_bikes_target > nb_bikes) {
			create bike number:nb_bikes_target - nb_bikes{
	      		type <- "bike";
		  		location<-any_location_in(one_of(building));
		  		speed<-2+rnd(maxSpeed);	
			}
		} else if (nb_bikes_target < nb_bikes) {
			ask (nb_bikes - nb_bikes_target) among bike {
				do die;
			}
		}
		
		int nb_bus <- length(bus);
		int nb_bus_target <- round(nbAgent * get_mobility_ratio()["bus"]);
		if (nb_bus_target > nb_bus) {
			 create bus number:nb_bus_target - nb_bus{
	      		type <- "bus";
		  		location<-any_location_in(one_of(road));	
			}
		} else if (nb_bus_target < nb_bus) {
			ask (nb_bus - nb_bus_target) among bus {
				do die;
			}
		}
	}
	
	
	list<list<intersection>> find_connection(intersection i1, int state){
		list<intersection> reachable <-[];
		list<intersection> can_reach <-[];
		loop i over: driving_road_network[state].vertices - i1{
			if not(empty(path_between(driving_road_network[state],i1,intersection(i)).edges)){reachable <<i;}
			if not(empty(path_between(driving_road_network[state],intersection(i),i1).edges)){can_reach <<i;}
		}
		return [reachable, can_reach];
	}
	reflex globalUpadte{
		if(speedUpSim){
			if(step>speedUpSpeedMin){
			 step<-step-speedUpSpeedDecrease;	
			}
		}
	}
}

species culture {//schedules:[]{
	list<string> state;
	string type;
	string style;
	float capacity;
	string visible;
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
		if(showUsage and (currentSimuState_str in state) and visible="yes" ){
		  draw shape color: usage_colors[type];	
		  if(showWaitingLine){
		    draw queue color: #white;	
		  }
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
		  draw shape color:rgb(75,75,75) empty:true depth:0;	
		}
	}
}


species park {
	list<string> state;
	string type; 
	rgb color <- #darkgreen  ;
	
	aspect base {
		if(showNature and (currentSimuState_str in state)){
		  draw shape color: nature_colors[type]-100 border:nature_colors[type];	
		}	
	}

}


species road  skills: [skill_road]{// schedules:[] {
	int id;
	int tl_group;
	bool ped_block <- false;
	list<bool> is_tunnel <- list_with(stateNumber,false);
	rgb color;
	string mode;
	float capacity;		
	string oneway;
	bool hot_spot <- false;
	bool to_display <- true;
	list<int> lanes_nb;
	list<list<point>> vec_ref;
	list<list<float>> offset_list;
	list<float> angles;
	float mean_speed;
	list<float> current_speeds;
	int windows_duration <- 5;
	int cpt_cycle;
	int time_accept <- 100;
	int cpt_accept;
	float sidewalk_size;
	list<int> ped_way;
//	int p_before;
//	int p_after;
	list<int> nb_car_max <- lanes_nb accumulate (1 + round(shape.perimeter * each / 10));//	[1 + round(shape.perimeter * lanes_nb[0] / 10), 1 +round(shape.perimeter * p_after / 10)] ;
	
	bool has_traffic_jam {
		list<agent> ags <- all_agents;
		return (length(ags) > (nb_car_max[currentSimuState] / 0.75)) and ((ags mean_of (car(each).real_speed)) < 5 #km/#h);
	}
	
	reflex compute_mean_real_speed {
		cpt_cycle <- cpt_cycle + 1;
		current_speeds <- current_speeds + (all_agents collect car(each).real_speed);
		if cpt_cycle > windows_duration {
			cpt_cycle <- 0;
			mean_speed <- empty(current_speeds) ? maxspeed : (mean(current_speeds) #km/#h);
			current_speeds <- [];
		}
		if (mean_speed < 1.0) {
			cpt_accept <- cpt_accept + 1;
		} else {
			cpt_accept <- 0;
			
		}
		if false and (target_node != nil and (intersection(target_node).is_traffic_signal) and cpt_accept > time_accept) {//false a enlever apres les tests
			ask intersection(target_node) {
				do free;
			}
		} 
	}
	
	//action (pas jolie jolie) qui change le nombre de voie d'une route.
	action change_number_of_lanes(int new_number) {
		if new_number = 0{
			to_display <- false;
		}else {
			to_display <- true;
			int prev <- lanes;
			if prev = 0{
				agents_on <- list_with(new_number,list_with(length(shape.points)-1,[]));
			}else if prev < new_number {
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
				agents_on <- new_agents_on;		
			}
			lanes <- new_number;		
		}
	}
	
	float compute_offset(int current_lane){
		if lanes_nb[currentSimuState] = 0{
			return 0;
		}else{
			return offset_list[currentSimuState][min(current_lane,lanes_nb[currentSimuState] -1)];
		}
	}

// ne pas enlever tout de suite au cas ou ce soit necessaire pour d'autres tests	
//	action essai(int cs){
//		point offset2 <- {0,0};
//
//			if cs < length(self.angles) {
//				float a <- self.angles[cs];
//				if mod(a,180) < 5 or mod(a,180)> 175{
//					offset2 <-  vec_ref[cs][1]*compute_offset(2);
//				}else{
//					//offset2 <-  vec_ref[cs][1]*compute_offset(2);
//					offset2 <- (vec_ref[cs][0]-vec_ref[cs+1][0])*compute_offset(2)/sin(a);
//				}
//				draw line([shape.points[cs+1],shape.points[cs+1]+offset2*3])color: #green;
//				return offset2;
//			}else{
//				list ll <-	intersection(target_node).roads_out;
//				road r <- nil;
//				if length(ll)> 0{r <- road(first(ll));}
//				if r != nil{
//					float a <- angle_between(last(shape.points),shape.points[length(shape.points)-2],r.shape.points[1]);
//					if !is_number(a){//probleme de precision avec angle_between qui renvoie un #nan
//						a <- 180.0;
//					}
//					if mod(a,180) < 5 or mod(a,180)> 175{
//						offset2 <- vec_ref[cs][1]*compute_offset(2);
//					}else{
//						offset2 <- (vec_ref[cs][0]*r.compute_offset(2)-r.vec_ref[0][0]*compute_offset(2))/sin(a);
//					}
//					draw line([last(shape.points),last(shape.points)+offset2*3])color: #yellow;
//					return offset2;
//				}else{
//					return {0,0};
//				}
//			}
//	}
	
	
	aspect base {
		if(showRoad and to_display){
			draw shape color:is_tunnel[currentSimuState]?rgb(50,0,0):type_colors["car"] width:1;
//			loop i from: 0 to: length(vec_ref)-1 step: 1{
//				do essai(i);
//			}
		}
//		if ped_block{
//			draw shape color: #red;
//		}
	}
}

species bikelane{
	bool from_road <- true;
	bool is_cold_spot <- false;
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

species station {//schedules: [] {
	rgb color;
	string type;
	int capacity;
	float capacity_pca;
	float delay <- rnd(2.0,8.0) #mn ;
	//Create people going in and out of metro station
	reflex add_people when: (type = "metro") and (length(pedestrian) < nbAgent*mobilityRatioNow["people"]) and every(delay){
		
		create pedestrian number:rnd(0,10)*int(capacity){
			type<-"people";
			location<-any_location_in(myself);
		}
	}
	aspect base {
		if(showStation){
		  	if(type="metro"){
		  	  draw circle(20) - circle(16) color:#blue;	
		  	  draw circle(16) color:#white;	
		  	}
		  	if(type="bus"){
		  	  draw circle(20) - circle(16) color:#yellow;	
		  	  draw circle(16) color:#white;		
		  	}
		  }	
	}
}

species pedestrian skills:[moving] control: fsm {//schedules:[]{
	path tmp;
	string type;
	agent target_place;
	point target;
	float stroll_time;
	float visiting_time;
	float speed_walk <- rnd(minSpeedPeople,maxSpeedPeople);// #km/#h;
	bool to_exit <- false;
	float proba_sortie <- 0.3;
	float proba_wandering <- 0.3;
	float proba_culture <- 0.7;
	float offset <- rnd(0.0,1.0);
	point current_offset;
	point target_offset;
	
	bool blocked <- false;
	list<list<int>> blocked_at_phase;
	float blocked_timer <- 2#mn;
	bool show_story;
	
	bool waiting_at_traffic_light <- false;
	bool wandering <- false;
	bool to_culture <- false;
	bool visiting <- false;
	bool queuing <- false;
	bool ready_to_visit <- false;
	bool walking <- false;
	bool stroling_in_city<-false;
	bool stroling_in_park<-false;
	list<point> current_trajectory;
	
	int side;
	
	action updatefuzzTrajectory{
	
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
	//				test_ped <- true;
					target <- any_location_in(agent(one_of(people_graph[currentSimuState].edges)));
					target <- first(road(one_of(people_graph[currentSimuState].edges)).shape.points);
					wandering <- true;
					// FIXME speed_walk_current à uniformiser
					speed_walk_current <- speed_walk_current/ 3.0; // 
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
		if current_edge != nil{
			blocked <- false;
		//	bool blocked <- false;
			if road(current_edge).tl_group != 0{
				//FIXME A REMPLACER PAR HEADING ?
				point p1 <- (destination - location)/norm(destination-location)*10;
				// FIXME CHARGER DES LE DEBUT LA LISTE DE ROUTES
				int r_id <- 0;
				map<list<list<road>>> m <- ped_blocking_roads[currentSimuState];
				list<list<road>> l <- m[road(current_edge).tl_group];
	//			write ""+phase_per_group[road(current_edge).tl_group]+" "+road(current_edge).tl_group;
				list<road> l2 <- l[phase_per_group[road(current_edge).tl_group]-1];
				list<road> lr <- ped_blocking_roads[currentSimuState][road(current_edge).tl_group][phase_per_group[road(current_edge).tl_group]-1];  // <- blocked_roads[road(current_edge).tl_group] where (each.ped_block);
				loop while: !blocked and r_id < length(lr){
					if intersects(polyline([location+current_offset, location+current_offset+p1]),lr[r_id].shape){
						blocked <- true;
					}
					r_id <- r_id+1;
				}
			}
			if !blocked{
				do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;
			}else{
				blocked_timer <- blocked_timer - step;
			}
			if blocked_timer < 0{//action de debouchage un peu bourrine pour les piétons un peu perdus qui n'arrivent plus à traverser une rue
				blocked_timer <- 2#mn;
				do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;
			}
//			point p1 <- destination - location;
//			if i != nil and (p1.x*(i.location - location).x+p1.y*(i.location - location).y > 0) and not(i.is_green) {
//				
//				
//			}else{
//				do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;
////			//	if !wandering {do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;}
//			}
		}else{
			do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;
		//	if !wandering {do goto target: target on:people_graph[currentSimuState] speed: speed_walk_current;}
		}
		transition to: stroll_in_city when: not to_exit and wandering;// and location = target;
		transition to: stroll_in_park when: not to_exit and not wandering and not to_culture and location = target;
		transition to: queueing when: not to_exit and to_culture and location = target;
		transition to: outside_sim when:to_exit and location = target;
		do updatefuzzTrajectory;		
		exit {
			walking <- false;
		}
	}
	
	action reinit_path{
	//	current_path <- nil;
		current_edge <- nil;
		shape.attributes["reverse"] <- nil;
		shape.attributes["index_on_path"] <- nil;
		shape.attributes["index_on_path_segment"] <- nil;
		
	}
	state stroll_in_city {
		enter {
			do goto target: self.location;
			stroll_time <- rnd(1, 10)#mn;
			stroling_in_city<-true;
			tmp <- copy(current_path);
			current_path <- nil;
			do reinit_path;
		}
		stroll_time <- stroll_time - step;
		// do wander amplitude:10.0 speed:2.0#km/#h;// on: people_graph[currentSimuState];
		do wander on: people_graph[currentSimuState];
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: stroll_time = 0;
		exit{
			stroling_in_city<-false;
		}
	}
	
	
	state stroll_in_park {
		enter {
			stroll_time <- rnd(1, 10) #mn;
			stroling_in_park<-true;
		}
		stroll_time <- stroll_time - step;
		do wander bounds:target_place amplitude:10.0 speed:2.0#km/#h;
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: stroll_time = 0;
		exit{
		  stroling_in_park<-false;	
		}
	}
	
	state outside_sim {
		do updatefuzzTrajectory;
		do die;
	}
	
	//ce mot existe ?
	state queueing {
		enter {
			queuing<-true;
			ask culture(target_place) {
				do add_people(myself);
			}
		}
		transition to: visiting_place when: ready_to_visit;
		do updatefuzzTrajectory;
		exit {
			visiting <- false;
			ready_to_visit <- false;
			queuing<-false;
		}
	}
	
	state visiting_place {
		enter {
			visiting <- true;
			visiting_time <- rnd(10,120)  #mn;
		}
		visiting_time <- visiting_time - step;
		do wander bounds:target_place amplitude:10.0 speed:2.0#km/#h;
		do updatefuzzTrajectory;
		transition to: walk_to_objective when: visiting_time = 0;
		exit {
			visiting <- false;
		}
	}
	
	reflex compute_offset{
		target_offset <- calcul_loc();
		current_offset <- current_offset + (target_offset - current_offset)*0.3;
		if(showPeopleTrajectory){
			loop while:(length(current_trajectory) > peopleTrajectoryLength)
		  	{
		        current_trajectory >> first(current_trajectory);
		    }
		    if length(current_trajectory) = 0 or distance_to(location + current_offset,last(current_trajectory)) > 20 {
		    	current_trajectory << location + current_offset;	
		    }		       
		}		
	}
	
	point calcul_loc {
		if (current_edge = nil) {
			return {0,0};
		} else {
			float val <- side*((road(current_edge).lanes +1)*3 + ((currentSimuState=1) ? (offset*road(current_edge).sidewalk_size) : (offset*(road(current_edge).sidewalk_size)/2)));// + ((applyFuzzyness) ? rnd(-fuzzyness, fuzzyness): 0);
	//		float val <- 0;
	// valeur a modifier, valeur doit etre independante de la simu
			return{cos(heading + 90) * val, sin(heading + 90) * val};

		}
	} 
	
	aspect base{
		if(showPeople){
			//point p1 <- (destination - location)/norm(destination-location)*10;
			 draw square(peopleSize) color:type_colors[type] at:walking ? location+current_offset :location rotate: angle;
//			 if !blocked{
//			 	draw square(peopleSize) color:type_colors[type] at:walking ? location+current_offset :location rotate: angle;	
//				 draw square(1) color: type_colors[type] at: destination+current_offset;
//			 	draw polyline([location+current_offset, location+p1+current_offset]) color: type_colors[type]  ;
//			 }	else{
//			 	draw square(peopleSize) color:#cyan at:walking ? location+current_offset :location rotate: angle;	
//				 draw square(1) color: #cyan at: destination+current_offset;
//			 	draw polyline([location+current_offset, location+p1+current_offset]) color: #cyan  ;
//			 }
			 
		}
		if(showPeopleTrajectory and showPeople){
	       draw line(current_trajectory+[location+current_offset]) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,peopleTrajectoryTransparency);	
	  	}	
	  	
	  	if show_story{
	  		draw circle(10) at: location+current_offset empty: true color: #white;
	  		draw line([location+current_offset+{1,-1}*5*sqrt(2),location+current_offset+{1,-1}*30*sqrt(2)]) color: #white;
	  		draw line([location+current_offset+{1,-1}*30*sqrt(2)+{40*cos(angle),40*sin(angle)},location+current_offset+{1,-1}*30*sqrt(2)]) color: #white;
	  		string text1 <- "Jean-Claude Régnault, 27 ans";
	  		string text2 <- "Touriste";
	  		string text3 <-"Se rend au Grand Palais";
	  		draw text1 at: location+current_offset+{1,-1}*30*sqrt(2)+{40*cos(angle),40*sin(angle)} rotate: angle color:#white font:font("Helvetica", 15 , #plain);
	  		draw text2 at: location+current_offset+{1,-1}*30*sqrt(2)+{40*cos(angle),40*sin(angle)} + {-40 * sin(angle),40*cos(angle)} rotate: angle color:#white;
	  		draw text3 at: location+current_offset+{1,-1}*30*sqrt(2)+{40*cos(angle),40*sin(angle)} + {-80 * sin(angle),80*cos(angle)} rotate: angle color:#white;
	  	}
//	  	if show_story{
//			loop r over: people_graph[currentSimuState]{
//				draw 2 around(road(r).shape) color: #cyan;
//			}
//		}
	}
	
	aspect profile{
		 if (walking){
		   draw square(peopleSize) color:type_colors[type] at:walking ? calcul_loc() :location rotate: angle;		
		 }
		 if (visiting){
		   draw square(peopleSize*2) color:#red at:walking ? calcul_loc() :location rotate: angle;	
		 }
		 if(stroling_in_park){
		 draw triangle(peopleSize*2) color:#green at:walking ? calcul_loc() :location rotate: angle;
		 }
		 if(stroling_in_city){
		 draw triangle(peopleSize*2) color:#red at:walking ? calcul_loc() :location rotate: angle;
		 }
		 if(queuing){
		   draw square(peopleSize) color:#white at:walking ? calcul_loc() :location rotate: angle;	
		 }
	}
}

species bike skills:[moving] {//schedules:[]{
	string type;
	point my_target;
	list<point> current_trajectory;
	float maxSpeed<-10#km/#h;
	reflex choose_target when: my_target = nil {
		if (flip(proba_hot_target)) {
			my_target <- any_location_in(one_of(hot_bike_lanes));
		} else {
			my_target <- any_location_in(one_of(bikelane));
		}
		
		
		//my_target<-any_location_in(one_of(origin_destination_shapefile.contents));
	}
	reflex move{
	  do goto on: bike_graph target: my_target speed: speed move_weights:weights_bikelane ;
	  if (my_target = location) {my_target <- nil;}
	  loop while:(length(current_trajectory) > bikeTrajectory)
  	    {
        current_trajectory >> first(current_trajectory);
        }
        current_trajectory << location;
	}
	aspect base{
		if(showBike){
		 draw rectangle(bikeSize,bikeSize*2) color:type_colors[type] rotate:heading-90;	
		}	
		if(showBikeTrajectory and showBike){
	       draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,bikeTrajectoryTransparency);	
	  }
	}
}


species bus skills:[moving] {//schedules:[]{
	string type;
	point my_target;
	list<point> current_trajectory;
	
	reflex choose_target when: my_target = nil {
		my_target <- any_location_in(one_of(road));
	}
	reflex move{
	  do goto on: bus_graph target: my_target speed: 15#km/#h ;
	  if (my_target = location) {my_target <- nil;}
	  loop while:(length(current_trajectory) > busTrajectoryLength)
  	    {
        current_trajectory >> first(current_trajectory);
        }
        current_trajectory << location;
	}
	aspect base{
		if(showSharedMobility){
		 draw rectangle(busSize,busSize*3) color:type_colors[type] rotate:heading-90;	
		}	
		if(showSharedMobilityTrajectory){
	       draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,busTrajectoryTransparency);	
	  }
	}
}


species car skills:[advanced_driving] {//schedules:[]{		
	bool to_update <- false;
	bool test_car <- false;
	point target_offset <- {0,0};
	list<int> old_indexes <-[-1, 0, 0]; //[int(old_starting_intersection), old_current_index, old_segment_index_on_road]
	int fade_count <- 0;
	point current_offset <- {0,0};
	rgb color;
	intersection target_intersection;
	string nationality;
	string profile;
	string aspect;
	string type;
	float speed;
	bool in_tunnel -> current_road != nil and road(current_road).is_tunnel[currentSimuState];
	list<point> current_trajectory;
	point old_location;
	list<list<point>> trail;
//	list<list<point>> trail <- [[]];
	list<point> last_locations;
	intersection starting_intersection;
	point target;
	
	int cpt_blocked;
	int max_cpt_blocked <- 100;

	bool path_updated <- false;


	reflex manage_cpt_blocked {
		if real_speed = 0 {
			cpt_blocked <- cpt_blocked +1 ;
			
		} else {
			proba_respect_stops <- [1.0];
			cpt_blocked <- 0;
		}
	}
	
//	float external_factor_impact(agent new_road, float remaining_time) {
//		if (cpt_blocked > max_cpt_blocked) {
//			final_target <- nil;
//			remaining_time <- 0.0;
//		}
//		
//		if flip(proba_avoid_tj) {
//			bool has_traffic_jam <-road(new_road).has_traffic_jam();
//			if (has_traffic_jam) {
//				current_path <- nil;
//				remaining_time <- 0.0;
//			}
//		}
//		return remaining_time;
//	}
	
	
	reflex leave when: final_target = nil  {
		if (target_intersection != nil and target_intersection.exit[currentSimuState]=target_intersection) {// reached an exit
			if current_road != nil {
				ask current_road as road {
					do unregister(myself);
				}
			}
			current_lane <- 0;
			if flip(proba_used_od) {
				int od_index <- rnd_choice(od_weights[currentSimuState].values);
					starting_intersection <- od_origins[currentSimuState].values[od_index];
				target_intersection <- od_destinations[currentSimuState].values[od_index];
				current_lane <- 0;
				location <-starting_intersection.location;
				current_path <- set_path(od_paths[currentSimuState][od_index]);
			} else {
				starting_intersection <- one_of(possible_sources[currentSimuState]);
				target_intersection <- one_of(possible_targets[currentSimuState] - starting_intersection);
				location <-starting_intersection.location;
				current_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
			}
		current_trajectory <- [];
		trail <- [];
		current_offset <- {0,0};
		}else if (target_intersection != nil and target_intersection.exit[currentSimuState] != nil) {// reached a dead end
		 	starting_intersection <- target_intersection;
			target_intersection <- target_intersection.exit[currentSimuState];
			current_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
		}else{ // reached a generic target
			if flip(proba_used_od) {
				starting_intersection <- target_intersection;
				int od_index <- rnd_choice(od_weights[currentSimuState].values);
				target_intersection <- od_destinations[currentSimuState].values[od_index];
			}else{
				starting_intersection <- target_intersection;
				target_intersection <- one_of(possible_targets[currentSimuState] - starting_intersection);
			}
			current_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
		}
		path_updated <- true;
	}
	
	
	reflex fade when: (fade_count > 0){
	 	fade_count <- fade_count - 1;
		if fade_count = 0{
			if current_road != nil {
				ask current_road as road {
					do unregister(myself);
				}
			}			
			if flip(proba_used_od) {
				int od_index <- rnd_choice(od_weights[currentSimuState].values);
				starting_intersection <- od_origins[currentSimuState].values[od_index];
				target_intersection <- od_destinations[currentSimuState].values[od_index];
				current_lane <- 0;
				location <-starting_intersection.location;
				current_path <- set_path(od_paths[currentSimuState][od_index]);
			} else {
				starting_intersection <- one_of(possible_sources[currentSimuState]);
				target_intersection <- one_of(possible_targets[currentSimuState] - starting_intersection);
				location <-starting_intersection.location;
				current_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
			}	
			final_target <- target_intersection.location;
			current_lane <- 0;
			current_trajectory <- [];
			trail <- [];
		//	trail <- [[]];
			current_offset <- {0,0};

			path_updated <- true;
		}
	}
	
	
	reflex move when: final_target != nil{// laisser ce reflexe apres leave et fade pour un meilleur affichage de trajectoire
//	  	if (current_path = nil) {
//			current_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
//		}
	  	do drive;	
	}
	
	reflex compute_offset_and_trail{
		if smoothTrajectory{
			if path_updated or old_indexes[1] != current_index or old_indexes[2] != segment_index_on_road{

				target_offset <- compute_offset(3);
			}
			if current_road = nil{
				current_offset  <- current_offset + (target_offset - current_offset) * min([1,real_speed/100*step]);
			}else{
				point diff_offset <- (target_offset - current_offset);
				list<point> vecs <- road(current_road).vec_ref[segment_index_on_road];
				current_offset  <- current_offset + vecs[0]*(diff_offset.x*vecs[0].x+diff_offset.y*vecs[0].y)* min([1,real_speed/100*step])+ vecs[1]*(diff_offset.x*vecs[1].x+diff_offset.y*vecs[1].y)* min([1,3*real_speed/100*step]);			
			}
			
			
		}else{
			float val <- road(current_road).compute_offset(current_lane);
			val <- on_linked_road ? -val : val;
			if (current_road != nil){
				current_offset <- road(current_road).vec_ref[segment_index_on_road][1] * val;
			}		
		}

		
		if new_trail{
			do compute_trail;
		}else{
			loop while:(length(current_trajectory) > carTrajectoryLength){
	    		current_trajectory >> first(current_trajectory);
       		}
        	current_trajectory << location+current_offset;
		}
		old_location <- copy(location);
		old_indexes <- [int(starting_intersection), current_index,segment_index_on_road]; 
		path_updated <- false;
	}
	
	
	
	action update{
		path new_path;
		if current_road != nil{
			if road(current_road).lanes_nb[currentSimuState] = 0{//current road is not good. Fading
				fade_count <- 15;
			}else{//current road is good
				intersection ci <- driving_road_network[currentSimuState] target_of current_road;
				if (target_intersection in possible_targets[currentSimuState]) and (ci != target_intersection) {// target is good. Computing a new path			
					point save_location <- location;
					road cr <- road(current_road);
					int oldi <- segment_index_on_road;
					location <- last(cr.shape.points);	
					starting_intersection <- driving_road_network[currentSimuState] source_of current_road;	
					if ci.exit[currentSimuState] != nil{// current intersection is in a dead end
						target_intersection<- ci.exit[currentSimuState];
					}		
					new_path <- compute_path(graph: driving_road_network[currentSimuState], target: target_intersection);
					current_path <- ([cr]+list<road> (new_path.edges)) as_path driving_road_network[currentSimuState];
					location <- save_location;
					ask current_road as road {
						do unregister(myself);
					}
					current_road <- cr;
					ask cr{
						do register(myself, myself.current_lane);
					}
					starting_intersection <- driving_road_network[currentSimuState] source_of current_road;	
					current_index <- 0;
					segment_index_on_road <- oldi;
					final_target <- target_intersection.location;
					targets <- list<point> (current_path.edges accumulate (driving_road_network[currentSimuState] target_of each));
					current_target <- first(targets);					
				}else{//target is not good or car in last road of path
					current_path <- [road(current_road)] as_path driving_road_network[currentSimuState];
					target_intersection <- driving_road_network[currentSimuState] target_of current_road;
					starting_intersection <- driving_road_network[currentSimuState] source_of current_road;	
					current_index <- 0;
					final_target <- target_intersection.location;
					current_target <- final_target;
					targets <- [final_target];
				}
				path_updated <- true;
			}			
		}
		to_update <- false;	
	}
	
	action compute_trail {
		loop while:(length(trail) >  (carTrajectoryLength)){
	    	trail >> first(trail);
       	}
       	if old_location = location{
       		trail >> first(trail);
       	}else{
       		if current_road != nil and current_path != nil{  
	       		list<point> l;
	       		int ci <- 0;
	       		int cs <- 0;
	       		l <- [];
	       			if not(path_updated){
	       				ci <- old_indexes[1];
	       				cs <- old_indexes[2];
	       			}
	       			loop while: (ci < current_index) or (ci = current_index and cs <segment_index_on_road){
						road cr <- road(current_path.edges[ci]);
	       				//l << cr.shape.points[cs+1] + cr.vec_ref[cs][1] * cr.compute_offset(current_lane);
	       				l << cr.shape.points[cs+1]+compute_offset_simple(ci,cs)+rnd(-1.0,1.0);
	       				cs <- cs + 1;
	       				if cs > length(road(current_path.edges[ci]).shape.points)-2{
	       					cs <- 0;
	       					ci <- ci + 1;
	       				}
	       			}
	       			trail << l;// + [location + current_offset];				
	       	}
	    }
	}



	action remove_and_die {
		if (current_road != nil) {
			ask road(current_road) {
				do unregister(myself);
			}
		}
		do die;
	}

	path set_path(path p){
		if current_road != nil{
			ask current_road as road {
				do unregister(myself);
			}
		}
		ask road(first(p.edges)){
			do register(myself, myself.current_lane);
		}	
		current_index <- 0;
		segment_index_on_road <- 0;
		final_target <- target_intersection.location;
		targets <- list<point> (p.edges accumulate (driving_road_network[currentSimuState] target_of each));
		current_target <- first(targets);
		return p;
	}
	
	point calcul_loc {
		if (current_road = nil) {
			return location;
		} else {		
			return (location + current_offset);
		}
	} 
	
		
	point compute_offset(int s){	
		if current_road = nil or current_path = nil{
			return current_offset;
		}else{
			int ci <- current_index;
			int cs <- segment_index_on_road;
			int count <- 0;
			point offset_comp <- road(current_road).vec_ref[0][1]*road(current_road).compute_offset(current_lane);
			float weight <- 1.0;
			loop while: (count < s - 1) and ci < length(current_path.edges) {
				count <- count + 1;
				road cr <- road(current_path.edges[ci]);
				if cs < length(cr.angles) {
					float a <- cr.angles[cs];
					float w <- 1+abs(a-180);
					weight <- weight + w;
					if mod(int(a),180) < 15 or mod(int(a),180)> 165{
						offset_comp <- offset_comp + cr.vec_ref[cs][1]*cr.compute_offset(current_lane)*w;
					}else{
						offset_comp <- offset_comp + (cr.vec_ref[cs][0]-cr.vec_ref[cs+1][0])*cr.compute_offset(current_lane)/sin(a)*w;
					}
					cs <- cs + 1;
				}else {
					if ci + 1 < length(current_path.edges){
						road cr2 <- road(current_path.edges[ci+1]);
						float a <- angle_between(last(cr.shape.points),cr.shape.points[length(cr.shape.points)-2],cr2.shape.points[1]);
						if !is_number(a){//probleme de precision avec angle_between qui renvoie un #nan
							a <- 180.0;
						}
						float w <- 1+abs(a-180);
						weight <- weight + w;
						if mod(int(a),180) < 15 or mod(int(a),180)> 165{
							offset_comp <- offset_comp + cr.vec_ref[cs][1]*cr.compute_offset(current_lane)*w;
						}else{
							offset_comp <- offset_comp + (cr.vec_ref[cs][0]*cr2.compute_offset(current_lane)-cr2.vec_ref[0][0]*cr.compute_offset(current_lane))/sin(a)*(1+abs(a-180));
						}
					}
					ci <- ci + 1;	
					cs <- 0;
				}
			}
		
		return offset_comp / weight;
		}	
	}
	
	// to merge with previous function
	point compute_offset_simple(int ci, int cs){
		point offset;
		if current_road = nil or current_path = nil{
			return {0,0};
		}else{
			road cr <-  road(current_path.edges[ci]);
			if cs < length(cr.angles) {
				float a <- cr.angles[cs];
				if mod(int(a),180) < 15 or mod(int(a),180)> 165{
					offset <-  cr.vec_ref[cs][1]*cr.compute_offset(current_lane);
				}else{
					offset <-  cr.vec_ref[cs][1]*cr.compute_offset(current_lane);
					offset <- (cr.vec_ref[cs][0]-cr.vec_ref[cs+1][0])*cr.compute_offset(current_lane)/sin(a);
				}
				return offset;
			}else if ci +1 > length(current_path.edges)-1{
				return cr.vec_ref[cs][1]*cr.compute_offset(current_lane);
			}else{
				road cr2 <- road(current_path.edges[ci+1]);
				float a <- angle_between(last(cr.shape.points),cr.shape.points[length(cr.shape.points)-2],cr2.shape.points[1]);
				if !is_number(a){//probleme de precision avec angle_between qui renvoie un #nan
					a <- 180.0;
				}
				if mod(int(a),180) < 15 or mod(int(a),180)> 165{
					offset <- cr.vec_ref[cs][1]*cr.compute_offset(current_lane);
				}else{
					offset <- (cr.vec_ref[cs][0]*cr2.compute_offset(current_lane)-cr2.vec_ref[0][0]*cr.compute_offset(current_lane))/sin(a);
				}
				return offset;
			}
		}	
	}
	
	
	aspect base {
		if(showCar){
		    draw rectangle(carSize,carSize*2.5) at: calcul_loc() rotate:heading-90 color:in_tunnel?rgb(50,0,0):rgb(type_colors[type],(fade_count=0)?1:fade_count/20);	   
	  	}
	  	if(showCarTrajectory and showCar){
	  		if new_trail{
  				draw line(trail accumulate(each)+[location+current_offset]) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,carTrajectoryTransparency);
	  		}else{
				draw line(current_trajectory) color: rgb(type_colors[type].red,type_colors[type].green,type_colors[type].blue,carTrajectoryTransparency );		
	  		}
	  	}

	  	if (test_car and showTestCar){	
	  		if current_path != nil{
	  			loop e over: current_path.edges{
	  				draw 3 around(road(e).shape) color: #white;
	  			}
	  		}
	  		loop p over: targets{
	  			draw circle(2#m) at: p color: #black; 
	  		}
	  		draw circle(2#m) at: starting_intersection.location color: #blue; 
	  		draw circle(2#m) at: last(targets) color: #yellow; 
	  		draw circle(2#m) at: current_target color: #yellow;
	  		draw circle(5#m) at: location color:#blue; 
	  		
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

species signals_zone{
		aspect base {
			draw shape empty: true  color:#green;		
		}
}

species intersection skills: [skill_road_node] {//schedules:[]{
	bool master_intersection <- false;
	rgb color <- #white; //used for integrity tests
	list<bool> reachable_by_all <- list_with(stateNumber,false);
	list<bool> can_reach_all <- list_with(stateNumber,false);
	list<intersection> exit <- list_with(stateNumber, nil);
	int phase;
	bool is_traffic_signal;
	bool is_crossing;
	int group;
	int id;
//	float time_to_change <- traffic_light_duration;
//	float free_time <- traffic_light_duration;
	float cpt_free;
	float counter <- rnd(traffic_light_duration);
	list<road> ways1;
	list<road> ways2;
	bool is_green;
	rgb color_fire;
	rgb color_group;
	bool active <- true;
	list<bool> activityStates <- list_with(stateNumber, true);
	bool is_free <- false;
	list<road> ped_xing_block <- [];
	
	action free {
		is_free <- true;
		if (not empty(stop)) {stop[0] <- [];}
	}
	
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
		if active{
			if not is_free {
				stop[0] <- ways2;
			}
			color_fire <- #green;
			is_green <- true;
		}
		
		
		if master_intersection{
			put self.phase at: self.group in: phase_per_group;
			//phase_per_group[self.group-1] <- self.phase;
			if length(blocked_roads)>0{
				loop r over: blocked_roads[self.group] {
					r.ped_block <- false;
				}
			}			
			
		}

		
		loop r over: ped_xing_block{
			r.ped_block <- true;
		}
	}

	action to_red {
		if active{
			if not is_free {
				stop[0] <- ways1;
			}
			color_fire <- #red;
			is_green <- false;
		}
	}
	
	action change_activity{
		if active != activityStates[currentSimuState]{
			active <- activityStates[currentSimuState];
			if not active {
				stop[0] <- [];
			}
		}
	}

//	reflex dynamic_node when: active and is_traffic_signal {
	reflex dynamic_node when: is_traffic_signal {
		counter <- counter + step;
		if (is_free) {
			cpt_free <- cpt_free+ step;
			if (cpt_free > traffic_light_duration) {
				cpt_free <- 0.0;
				is_free <- false;
			}
		}
		if (counter >= traffic_light_duration) {
			counter <- 0.0;
			if is_green {
				do to_red;
			} else {
				do to_green;
			}
		}

	}

	aspect default {
		if showTrafficSignal and !is_traffic_signal{
			draw circle(3#m) color: color;
		}

		if (is_traffic_signal and showTrafficSignal) {
			if active{
				draw circle(5) color: color_fire;
			}else{
				draw circle(5) color: #white empty: true;
			}
		}
		if false and showPedBlock and int(self)=1 and cycle > 5 {
			loop i over: phase_per_group.keys{
				loop r over: ped_blocking_roads[currentSimuState][i][phase_per_group[i]-1]{
					draw 3 around(r.shape) color: #cyan;
				}	
			}
			loop i over: blocked_roads.keys{
				loop r over: blocked_roads[i]{
					draw 5 around(r.shape) color: #yellow;
				}
			}
		}
		
		
	}
	
		
	
}

species coldSpot{
		aspect base {
			if(showHotSpot){
			  draw shape color:rgb(0,0,0);	
			}	
		}
}

experiment debug_xp type: gui autorun:true{
	action _init_ {
		create simulation with: [showCar::true, showPeople::true,showBike:: true, showSharedMobility::true, showNature::true,showUsage::true,
			showCarTrajectory::false, showPeopleTrajectory::false, showBikeTrajectory::false, showSharedMobilityTrajectory::false,
			showBikeLane::true, showBusLane::true, showStation::true,showTrafficSignal::true, showRoad::true, showBuilding::false,
			showWaitingLine::true
		];
	
	}
	output {
		display champ 
	   	{
	   	    species park aspect: base transparency:0.5;
			species culture aspect: base transparency:0.5;
			species road aspect: base;
			species bus_line aspect: base;
			species intersection;
			species car aspect:base transparency:0.5;
			species pedestrian aspect:base transparency:0.2;
			species bike aspect:base transparency:0.5;
			species bus aspect:base transparency:0.5;
			species station aspect: base;
			species bikelane aspect:base;
			
			graphics "shortest_path" {
				if (shortest_path != nil and shortest_path.shape != nil) {
					draw shortest_path.shape + 1 color: #magenta;
				}
				if (source != nil) {
					draw circle(10) at:source color: #yellow;
				}
				if (destination != nil) {
					draw circle(10) at:destination color: #cyan;
				}
			}
//			graphics "origin" {
//				loop pt over: origin_intersections[currentSimuState] {
//					draw circle(10) color: #magenta at: pt.location;
//				}
//			}
//			graphics "destination" {
//				loop pt over: destination_intersections[currentSimuState] {
//					draw circle(10) color: #cyan at: pt.location;
//				}
//			}
			
			event mouse_down action:{
				if (test_path and (#user_location != nil)) {
					if (source = nil) { 
						source <- (list(intersection) with_min_of (each distance_to #user_location)).location;
					}
					else if (destination = nil) {
						destination <- (list(intersection) with_min_of (each distance_to #user_location)).location;
					} 
					if (source != nil and destination != nil) {
						shortest_path <- driving_road_network[currentSimuState] path_between(source, destination);
						source <- nil;
						destination <- nil;
					}
					
				} 
			};
			event["p"] action: {
				test_path<-not test_path; 
				if not test_path {
					shortest_path <- nil;
					source <- nil;
					destination <- nil;
				}
			};	
			event["z"] action: {updateSim<-true;};			
		}
	}
	

	}
	
experiment ReChamp type: gui autorun:true{
	float minimum_cycle_duration<-0.025;	
	output {

		display champ type:java2D background:#black draw_env:false fullscreen:1  rotate:angle toolbar:false autosave:false synchronized:true
		//keystone: [{-0.013304996333086516,-0.20481627737204344,0.0},{-0.20955369224611214,1.2158602923283832,0.0},{1.2068926929794948,1.1345361821953643,0.0},{1.0159659955997027,-0.20180427329304296,0.0}]
		//jcdejc//keystone: [{-0.014738965813206717,-0.20627849103413565,0.0},{-0.21815858242101588,1.2218738054155063,0.0},{1.2011252888238215,1.1272618466329627,0.0},{1.0170732004605543,-0.200356051098873,0.0}]
	   	//<jc keystone: [{-0.13581443244429375,0.046729851601918004,0.0},{-0.041202131190965566,1.060229586509137,0.0},{0.9549828566617228,1.0228457052276037,0.0},{1.01042070229401,0.033576265703510244,0.0}]
	   	{

	   	    species graphicWorld aspect:base;	    	
		    species building aspect: base;
			species park aspect: base transparency:0.5 + 0.5 *(crossOverNature/crossOverTime);
			species culture aspect: base transparency:0.5 + 0.5 *(crossOverUsage/crossOverTime);
			species road aspect: base;
			species vizuRoad aspect:base transparency:0.5;
			species bus_line aspect: base;
			species intersection;
			species car aspect:base transparency:0.5 + 0.5 *(crossOverCar/crossOverTime);
			species pedestrian aspect:base transparency:0.2 + 0.8 *(crossOverSoftMob/crossOverTime);
			species bike aspect:base transparency:0.5 + 0.5 *(crossOverSoftMob/crossOverTime);
			species bus aspect:base transparency:0.5 + 0.5 *(crossOverSoftMob/crossOverTime);
			species coldSpot aspect:base transparency:0.6;
			species station aspect: base;
			species bikelane aspect:base;

									
			graphics 'tablebackground'{
				draw geometry(shape_file_bounds) color:#white empty:true;
				draw string("State: " + currentSimuState) rotate:angle at:{400,400} color:#white empty:true;
			}
			
			graphics "legend"{
				if(drawLegend){
					point lengendBox<-{360,100};
					point posIn<-{world.shape.width*0.4, world.shape.height*0.7};
					draw rectangle (lengendBox.x,lengendBox.y) at:posIn +{(lengendBox.x*0.9)/2* cos (angle), (lengendBox.x*0.9)/2 * sin(angle)} rotate:angle empty:true color:#gray;//+{lengendBox.x/2* cos (angle), lengendBox.x/2 * sin(angle)} color:#white rotate:angle empty:true;
					float space<-world.shape.width * 0.025;
					float circleSize<-world.shape.width * 0.0025;
					int fontSize<-10;
					point textOffset<-{10,10};
				    draw circle(circleSize) color: type_colors["car"] at: posIn;
					draw "voiture" color: type_colors["car"]  at: posIn + textOffset font:font("Helvetica", fontSize , #bold)  rotate:angle;
					draw circle(circleSize) color: type_colors["people"] at: posIn + {space* cos (angle), space * sin(angle)};
					draw "pieton" color: type_colors["people"]  at: posIn + {space* cos (angle), space * sin(angle)} + textOffset font:font("Helvetica", fontSize , #bold) rotate:angle;
					draw circle(circleSize) color: type_colors["bike"] at:  posIn + {space* cos (angle), space * sin(angle)}*2;
					draw "vélo" color: type_colors["bike"]  at: posIn + {space* cos (angle), space * sin(angle)}*2 + textOffset font:font("Helvetica", fontSize , #bold) rotate:angle;
					draw circle(circleSize) color: type_colors["bus"] at: posIn + {space* cos (angle), space * sin(angle)}*3;
					draw "bus" color: type_colors["bus"]  at: posIn + {space* cos (angle), space * sin(angle)}*3 + textOffset font:font("Helvetica", fontSize , #bold) rotate:angle;
				}
					
			}

			
			event["p"] action: {showPeople<-!showPeople;};
			event["c"] action: {showCar<-!showCar;};
			event["v"] action: {showBike<-!showBike;};
			event["b"] action: {showSharedMobility<-!showSharedMobility;};
			event["n"] action: {showNature<-!showNature;};
			event["u"] action: {showUsage<-!showUsage;};
			event["l"] action: {showBuilding<-!showBuilding;};
			event["r"] action: {showRoad<-!showRoad;};
			event["m"] action: {showHotSpot<-!showHotSpot;};
			event["f"] action: {showTrafficSignal<-!showTrafficSignal;};			
			event["z"] action: {ask world{do updateStoryTelling (0);}updateSim<-true;showCar<-true;showPeople<-true;showBike<-true;showSharedMobility<-true;showNature<-true;showUsage<-true;};
			event["h"] action: {ask world{do updateStoryTelling (0);}updateSim<-true;showCar<-true;showPeople<-true;showBike<-true;showSharedMobility<-true;showNature<-true;showUsage<-true;};
			
			//event["l"] action: {drawLegend<-!drawLegend;};
			//event["1"] action: {if(currentSimuState!=1){currentSimuState<-1;updateSim<-true;}};
			
			event["1"] action: {ask world{do updateStoryTelling (1);}};
			event["2"] action: {ask world{do updateStoryTelling (2);}};
			event["3"] action: {ask world{do updateStoryTelling (3);}};
			event["4"] action: {ask world{do updateStoryTelling (4);}};
			
			event["w"] action: {ask world{do updateStoryTelling (1);}};
			event["c"] action: {ask world{do updateStoryTelling (2);}};
			event[";"] action: {ask world{do updateStoryTelling (3);}};
			event["="] action: {ask world{do updateStoryTelling (4);}};
		}
	}
}
	

experiment ReChamp2Proj parent:ReChamp autorun:true{	
	
	output {	
		layout #horizontal;
		display indicator type:java2D background:#black draw_env:false fullscreen:0 toolbar:false
		//camera_pos: {1812.4353,1521.574,1490.9658} camera_look_pos: {1812.4353,1521.548,0.0} camera_up_vector: {0.0,1.0,0.0}
		{
		    graphics 'dashboardbackground'{
		    	if(oneButtonInterface){
		    		if(currentSimuState=0){
		    			draw rectangle(1920,1080) texture:dashboardbackground_before.path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1){
		    			draw rectangle(1920,1080) texture:dashboardbackground_after.path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    	}else{
		    		if(currentSimuState=0 and currentStoryTellingState=0){
		    			draw rectangle(1920,1080) texture:dashboardbackground_before.path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1 and currentStoryTellingState=0){
		    			draw rectangle(1920,1080) texture:dashboardbackground_after.path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=0 and currentStoryTellingState=1){
		    			draw rectangle(1920,1080) texture:radarPlots[0].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1 and currentStoryTellingState=1){
		    			draw rectangle(1920,1080) texture:radarPlots[3].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=0 and currentStoryTellingState=2){
		    			draw rectangle(1920,1080) texture:radarPlots[0].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1 and currentStoryTellingState=2){
		    			draw rectangle(1920,1080) texture:radarPlots[3].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=0 and currentStoryTellingState=3){
		    			draw rectangle(1920,1080) texture:radarPlots[1].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1 and currentStoryTellingState=3){
		    			draw rectangle(1920,1080) texture:radarPlots[4].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=0 and currentStoryTellingState=4){
		    			draw rectangle(1920,1080) texture:radarPlots[2].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		if(currentSimuState=1 and currentStoryTellingState=4){
		    			draw rectangle(1920,1080) texture:radarPlots[5].path at:{world.shape.width/2,world.shape.height/2}color:#white empty:true;
		    		}
		    		
		    	}
		    	
		    	
		    	
		    	
				
				
			}
			/*graphics "state" {
				write currentStoryTellingState;
				float textSize<-10#px;
				float spacebetweenLine<-textSize*2;
				point spacebetweenBlock<-{200#px,world.shape.height/8};
				float spacebetween<-200#px;
				
				float spacebetweenSame<-250#px;
				draw ((currentSimuState = 0 ) ? "TODAY" :"VISION") color: #white font: font("Helvetica", textSize*2, #bold) at: {world.shape.width*0.75,world.shape.height*0.25};
				float curY<-spacebetweenBlock.y;
				float curX<-0.0;
				
				if(currentStoryTellingState=1){ 
				  if(currentSimuState =0){
				  draw (catchPhrase[0]) color: type_colors["car"] font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("VOIRIE DEDIEE") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Véhicules Individuels 33%") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Véhicules Partagés 5%") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("POLLUTION DE L'AIR") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Emission de CO2 318 670") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("TRAFFIC") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Vehicule/heure: 10 250") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				   draw ("VOIE CIRCULLEE") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de l'Etoile: 11") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Champs Elysées:6") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Winston Churchill:4") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de la concorde:12") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};		
				  }else{
				  draw (catchPhrase[0]) color: type_colors["car"] font: font("Helvetica", textSize, #bold) at: {curX,curY};	
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;	
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("VOIRIE DEDIEE") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Véhicules Individuels 16% (-51%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Véhicules Partagés 6% (+12%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("POLLUTION DE L'AIR") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Emission de CO2 165 000 (-48%) ") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("TRAFFIC") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Vehicule/heure: 7 800 (-24%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("VOIE CIRCULLEE") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de l'Etoile: 7 (-40%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Champs Elysées:4 (-33%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Winston Churchill:0 (-100%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de la concorde:4 (-67%)") color: type_colors["car"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  }
				}
				if(currentStoryTellingState=2){
				if(currentSimuState =0){
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[1]) color: type_colors["bike"] font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("VOIRIE DEDIEE") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Mobilités Douces 2%") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Piéton 60%") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("POLLUTION DE L'AIR") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Emission de CO2 318 670") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("TRAFFIC") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Vehicule/heure: 10 250") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				   draw ("VOIE CIRCULLEE") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de l'Etoile: 11") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Champs Elysées:6") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Winston Churchill:4") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de la concorde:12") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};		
				  }else{
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[1]) color: type_colors["bike"] font: font("Helvetica", textSize, #bold) at: {curX,curY};	
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("VOIRIE DEDIEE") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Mobilités Douces 4% (+66%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Piéton 74% (+23%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("POLLUTION DE L'AIR") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Emission de CO2 165 000 (-48%) ") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("TRAFFIC") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Vehicule/heure: 7 800 (-24%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("VOIE CIRCULLEE") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de l'Etoile: 7 (-40%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Champs Elysées:4 (-33%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Ave Winston Churchill:0 (-100%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Place de la concorde:4 (-67%)") color: type_colors["bike"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  }
				}
				
				if(currentStoryTellingState=3){	
				  if(currentSimuState =0){
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[2]) color: type_colors["bus"] font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("PERMEABILITE DES SOLS") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Sol Perméable  38%") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Pleine de terre 75 000m2") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Strate Végétale 32 000m2") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("Nombre d'arbes: 4 280") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("RAFRAICHISSEMENT") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Temperature chaussée  35°C") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Temperature trottoir 35°C") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("EAU DE PLUIE") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Absorbée/Evaporée 56 000 m2") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Envoyée à l'égout 355 000 m3") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};				  
				  }else{
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[2]) color: type_colors["bus"] font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  curY<-curY+spacebetweenLine;
				  draw ("PERMEABILITE DES SOLS") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Sol Perméable  58% (+53%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Pleine de terre 112 400m2 (+49%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Strate Végétale 95 000m2 (+196%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};	
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("Nombre d'arbes: 5 420 (+26%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("RAFRAICHISSEMENT") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Temperature chaussée  33.5°C (-1.5°C)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Temperature trottoir 31°C (-4°C)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("EAU DE PLUIE") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Absorbée/Evaporée 140 000 m2 (+150%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Envoyée à l'égout 271 500 m3 (-24%)") color: type_colors["bus"] font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  }
				}

				if(currentStoryTellingState=4){ 
				  if(currentSimuState =0){
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[3]) color: #yellow font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  draw ("RESTAURATION") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Offre Existante 6") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Surface de Pique-Nique 12 400 m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("PROMENADE") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Promenade Pietonne 257 000 m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Surface Ombragée 45 000 m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Assises 458") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Fontaine d'eau potable 10") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY}; 
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("Aménités") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Espace de détente 7300 m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Espace de Sport 0m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Air de Jeux 340 m2") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};			  
				  }else{
				  curY<-spacebetweenBlock.y;
				  curX<-0.0;
				  draw (catchPhrase[3]) color: #yellow font: font("Helvetica", textSize, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenBlock.y;
				  draw ("RESTAURATION") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Offre Augmentée 26 (+333%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Surface de Pique-Nique 54 300 m2 (+338%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curX<-curX+spacebetweenBlock.x;			  
				  curY<-curY+spacebetweenBlock.y;
				  draw ("PROMENADE") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Promenade Pietonne 332 000 m2 (+29%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Surface Ombragée 110 000 m2 (+145%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Assises 1 540 (+236%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				   curY<-curY+spacebetweenLine;
				  draw ("Fontaine d'eau potable 81 (+710%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY}; 
				  curY<-curY+spacebetweenLine;
				  curY<-curY+spacebetweenBlock.y;
				  curX<-curX+spacebetweenBlock.x;
				  draw ("Aménités") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Espace de détente 50 200 m2 (+585%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Espace de Sport 2 850m2 (+100%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  curY<-curY+spacebetweenLine;
				  draw ("Air de Jeux 1580 m2 (+365%)") color: #yellow font: font("Helvetica", textSize/3, #bold) at: {curX,curY};
				  }
			  }
			}*/
		}
	}
}

