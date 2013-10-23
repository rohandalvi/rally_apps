 var projects_array = new Array();
        var child_project = new Array();
        function onLoad() {
            //Add app code here
            
            
            loadProjectDropdown();
        }
        
        function loadProjectDropdown()
        {
        	
        	var rallyDataSource = new rally.sdk.data.RallyDataSource("__WORKSPACE_OID__","__PROJECT_OID__","__PROJECT_SCOPING_UP__","__PROJECT_SCOPING_DOWN__");
        	
        	
        	var queryArray = new Array();
        	queryArray.push({
        		key:"projects",
        		type:"project",
        		fetch: "Children,Name",
        		query: rally.sdk.util.Query('ObjectID = "' + '__PROJECT_OID__' + '"')	
        		
        		});
        	
        	rallyDataSource.findAll(queryArray,processQueryArray);
        	
        }
        
        function processQueryArray(results){
        	
        	var data = new Array();
        	
        	var project = results.projects;
        	
        	/*
        	 * 
        	 * This is just a test from Rohan
        	 */
        	//var all_projects = new Array();
        	data.push({label: project[0].Name, value: project[0].Name});
        	
        	if(project[0].Children != null)
        	{
        		for(var i=0;i<project[0].Children.length;i++)
        		{
        			//document.write("Number "+i+" "+project[0].Children[i].Name);
        			data.push({label: project[0].Children[i].Name, value: project[0].Children[i].Name});
        		}
        	}
        	        	
        	
			//pass the first parent project to a function that recursively gets all child projects.
			
			//all_projects = get_child_recursively(project[0]);	
			
			
			//document.write(JSON.stringify(all_projects));
			
			
				
        	projectDropDown = new rally.sdk.ui.basic.Dropdown({label: "Select Project", items: data, width: 250});
        	projectDropDown.display("projectDropDown",projectDropDownChanged);
        }
        
        //Recursive algorithm to get all child projects of a parent project
        function get_child_recursively(parent_project)
        {
        		
        		
        		projects_array.push(parent_project);
        		
        		if(parent_project.Children.length>0)
        		{
        			for(var i=0;i<parent_project.Children.length;i++)
        			{
        				if(child_project.indexOf(parent_project.Children[i])<=-1)
        					child_project.push(parent_project.Children[i]);
        			}
        			for(var i=0;i<child_project.length;i++)
        			{	var temp = child_project[i];
        				child_project.splice(i,1);
        				get_child_recursively(temp);
        			}
        		}
        		else{
        			return;
        		}
        		
        		if(child_project.length==0 || child_project.length==1){
        			return projects_array;
        		}
        		
  		}      
        function projectDropDownChanged(dropdown,eventArgs){
        	
        	projectName = eventArgs.value;
        	
        	loadTeamMembersDropDown();
        
        }
        
        function loadTeamMembersDropDown(){
        
        	var rallyDataSource = new rally.sdk.data.RallyDataSource("__WORKSPACE_OID__","__PROJECT_OID__","__PROJECT_SCOPING_UP__","__PROJECT_SCOPING_DOWN__");
        	var rallyqueryObject = {
        		key: "projects",
        		type: "project",
        		fetch: "TeamMembers,Name",
        		query: rally.sdk.util.Query('Name = "' + projectName + '"' )
        		
        	};
        	
        	rallyDataSource.findAll(rallyqueryObject,processTeamMemberResult);
        }
        function processTeamMemberResult(results){
        	
        	var project = results.projects;
        	var teamMembers = project[0].TeamMembers;
        	document.write(JSON.stringify(teamMember[0].TeamMembers));
        }
        rally.addOnLoad(onLoad);