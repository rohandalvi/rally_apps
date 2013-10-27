 		 var projectName;
		 var table;
		 var nameTable;
         var projects_array = new Array();
         var optionDropdown;
         var nameDropdown;
         var projectDropDown;
         var textBox;
         var username;
         var child_project = new Array();
         var child_seen = new Array();
         var projects_array = new Array();
         var button;
         var flag;
         function onLoad() {
           //Add app code here
           loadOptionDropdown();

          }
                function loadOptionDropdown()
               {
               	var option = new Array();
               //	option.push({label: 'Select a value',value:'Select a value'});
               	option.push({label: 'By Project',value: 'By Project'});
               	option.push({label: 'By Name', value: 'By Name'});
               	optionDropdown = new rally.sdk.ui.basic.Dropdown({label: "Select Option", items: option, width: 250});
               	optionDropdown.display("optionDropDown",optionChanged);
               }
               
               function optionChanged(dropdown,eventArgs)
              {
              	var option = eventArgs.value;
              	// /document.write(eventArgs.value);
              	if(option=='By Name')
              		loadNameDropdown();
              	if(option=='By Project')
              		loadProjectDropdown();
              }
              function loadNameDropdown()
              {
              	destroy_components();
              	
              	textBox = new rally.sdk.ui.basic.TextBox({label: "UserName: ", value:"Example: Ray Angelone",width:250,rememberValue: false});
              	
              	textBox.display("nameDropDown",textBoxChanged);              	
              }
              
              function textBoxChanged(sender,eventArgs)
              {
              	 username = eventArgs.value;
              	
              	
              	 loadNamesTable();
              }
              function loadNamesTable()
              {
              	var rallyDataSource = new rally.sdk.data.RallyDataSource("__WORKSPACE_OID__","__PROJECT_OID__","__PROJECT_SCOPING_UP__","__PROJECT_SCOPING_DOWN__");
              	
              	var rallyQueryObject = {
              		key: "users",
                	type: "user",
                	fetch: "TeamMemberships,Name,DisplayName",
                	query: rally.sdk.util.Query('DisplayName = "' + username + '"' )
              	};
              	rallyDataSource.find(rallyQueryObject,processNameResult);              	
              }
              function processNameResult(results){
              
             	if(results.users.length>0){
             
              	var allmemberships = results.users[0].TeamMemberships;
				loadNameTable(allmemberships);
				}
				else
				{
					/*
					 * 2 scenarios, 1 -> User Not Found, 2-> User Found but no associated Team Memberships
					 * Case 1 gives this alert, Case 2 gives a table with nothing to display
					 */
					
					alert("No user found, please note the query works in the current workspace only.");
					
				}
              }
              function loadNameTable(allmemberships)
              {
              	var tableData = prepareMembershipTable(allmemberships);
              	
              	var tableColumns = new Array();
              	
              	tableColumns.push({
              		key: 'Member',
              		header: 'Member Projects',
              		width: 250
              	});
              	
              	var config = {
              		columns: tableColumns
              	};
              	
              	if(nameTable){
              		nameTable.destroy();
              		nameTable = null;
              	}
              	
              	nameTable = new rally.sdk.ui.Table(config);
              	nameTable.addRows(tableData);
              	nameTable.display('table');
              	
              	 if(button)
              	 {
              		 button.destroy();
              		 button=null;
              	}
         			//(JSON.stringify(tableData));
       			
         		button = new rally.sdk.ui.basic.Button({text: "Generate CSV",value:tableData});
         		flag = "loadNameTable";
         		button.display("button",generate_csv);
              	
              }
              
              function prepareMembershipTable(memberships)
              {
              	var rowObject = function(membership){
              		this["Member"] = membership;
              		this["ProjectName"] = username;
              	};
              	
              	var data = new Array();
              	
              	for(var i=0;i<memberships.length;i++)
              	{
              		var rowData = new rowObject(memberships[i].Name);
              		data.push(rowData);
              	}
              	
              	return data;
              }
          
              function destroy_components()
              {
              	if(projectDropDown){
              		projectDropDown.destroy();   
              		projectDropDown=null;   		
              	}
              	if(table)
              	{
              		table.destroy();	
              		table = null;        
              	}
              	
              	if(textBox)
              	{
              		textBox.destroy();
              		textBox=null;
              	}
              	if(nameTable)
              	{
              		nameTable.destroy();
              		nameTable=null;
              	}
              }
              
                
                function loadProjectDropdown()
                {
         			destroy_components();
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

                	var all_projects = new Array();
        			all_projects = get_child_recursively(project[0]); 
        				
   	    	 		for(var i=0;i<all_projects.length;i++)
        			  {
        			  		data.push({label: all_projects[i].Name, value: all_projects[i].Name});
        					
        			  }
        			
                	projectDropDown = new rally.sdk.ui.basic.Dropdown({label: "Select Project", items: data, width: 250});
                	projectDropDown.display("projectDropDown",projectDropDownChanged);
                }
                
                  function containsObject(obj,list)
                {
				    var i;
				    
				    for (i = 0; i < list.length; i++) {
				        if (list[i].Name === obj.Name) {
				            return true;
				        }
				    }
				
				    return false;
				}
                
                function get_child_recursively(parent_project)
                {
                	//Recursive algorithm to get all child projects of a parent project		
                		
                		if(!containsObject(parent_project,projects_array))
                		{	
                			projects_array.push(parent_project);
                		}
                		if(parent_project.Children.length>0)
                		{
                			for(var i=0;i<parent_project.Children.length;i++)
                			{
                				if(child_project.indexOf(parent_project.Children[i])<=-1)
                					child_project.push(parent_project.Children[i]);
              
                			}
                			while(child_project.length>0)
                			{	
                				var temp = child_project[0];
                				child_project.splice(0,1);
                				get_child_recursively(temp);
                			
                			}
                		}
                		else{
								if(child_project.length!=0)
 		               				return;
 		               			else
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
                		fetch: "TeamMembers,Name,DisplayName,Children",
                		query: rally.sdk.util.Query('Name = "' + projectName + '"' )
                		
                	};
                	rallyDataSource.findAll(rallyqueryObject,processTeamMemberResult);
                }
                function processTeamMemberResult(results){
                	
                	var teamMembers;
                	var c = results.projects;

                	var allprojectsrecursive = new Array();
                	projects_array.length=0;
                	allprojectsrecursive = get_child_recursively(c[0]);
                	//alert(JSON.stringify(allprojectsrecursive[5]));
                	var temp = new Array();
                	var allTeamMembers =  new Array();  
                	var string;
                	var newarr = new Array();
                	var k=-1;
                	for(var i=0;i<allprojectsrecursive.length;i++)
                	{
                		if((allprojectsrecursive[i].TeamMembers!=null) && (allprojectsrecursive[i].TeamMembers.length>0) && (allprojectsrecursive[i].TeamMembers!=" "))
                			{
                				for(var j=0;j<allprojectsrecursive[i].TeamMembers.length;j++)
                			{
                				
                				temp[++k]=allprojectsrecursive[i].TeamMembers[j];
                			}
                		}
                		
                	}
                	var final_array = remove_duplicates(temp);
                	
                	if(allTeamMembers.length==0)
                	{
                		teamMembers="";
                	}
                	
                	else if(allTeamMembers.length==1)
                	{
                		teamMembers = allTeamMembers[0];
                	}
                	else
                	{
                		
                		teamMembers = allTeamMembers[0];
                	}
                	loadMemberTable(final_array);
                }
                
                function compare_object(object,list)
                {
                	for(var i=0;i<list.length;i++)
                	{
                		if(list[i].DisplayName === object.DisplayName)
                			return true;
                	}
                	return false;
                }
                function remove_duplicates(array)
                {
                	var new_array = new Array();
                	for(var i=0;i<array.length;i++)
                	{
                		if(!compare_object(array[i],new_array))
                			new_array.push(array[i]);
                	}
                	return new_array;
                	
                }
                function loadMemberTable(members)
                {
                	
                	var tableData = prepareTableData(members);
                	
                	
                	var tableColumns = new Array();
                	tableColumns.push({
                		
                		key: 'Member',
                		header: 'Team Member',
                		width: 250
                		
                	});
                	
                	var config = {
                		columns: tableColumns
                	};
                	
                	if(table)
                	{
                		table.destroy();
                		table = null;
                	}
					
         			table = new rally.sdk.ui.Table(config);
         			table.addRows(tableData);
         			table.display('table');  
         			//remove if already exists
         			if(button)
         			{
         				button.destroy();
         				button=null;
         			}
         			
         			button = new rally.sdk.ui.basic.Button({text: 'Generate CSV', value: tableData});
         			flag="loadMemberTable";
         			button.display("button",generate_csv);
                }                
                function generate_csv(sender,eventArgs){
                	
                	data = eventArgs.value;
                	var dataString;
                	var csvContent = "data:text/csv;charset=utf-8,";
                	
                	if(flag=="loadMemberTable")
                	
                	dataString = "Member,Project"+"\n";
                	
                	else if(flag=="loadNameTable")
                	dataString = "Project,Member"+"\n";
                  	var final_array = new Array();
                  	
                  	for(var i=0;i<data.length;i++)
                  	{
                  		final_array[i] = data[i].Member+","+data[i].ProjectName;
                  	}
                  	 dataString += final_array.join("\n");
                  	 csvContent+=dataString;
                  	 
                  	 var encodedUri = encodeURI(csvContent);
                  	 var link = document.createElement("a");
                  	 link.setAttribute("href",encodedUri);
                  	 link.setAttribute("download","app_data.csv");
                  	 link.click();
                }
                function prepareTableData(members)
                {
                	
                	var rowObject = function(member){
                		this["Member"] = member;
                		this["ProjectName"] = projectName;
                		
                	};
                	var data = new Array();
                	
                	for(var i=0;i<members.length;i++)
                	{
                		
                		var rowData = new rowObject(members[i].DisplayName);
                		data.push(rowData);
                		
                		
                	}
                	//document.write(JSON.stringify(data));
                	return data;
                	
                }
                
                rally.addOnLoad(onLoad);
