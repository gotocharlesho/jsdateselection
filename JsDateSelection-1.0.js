/*
 * Extends the javascript default function to allow bind an object to a function
 */
Function.prototype.bind = function(obj) { 
  var method = this, 
  temp = function() { 
    return method.apply(obj, arguments); 
   };   
  return temp; 
} 

/**
 * @class JsDateSelection
 * Populate regular date selecting
 * @constructor
 * Create a new JsDateSelection
 * @param {Object} config
 */
var JsDateSelection = function(config){
		
    this.config = config || {};    
	this.init();

};

JsDateSelection.prototype = {
	/**
     * @cfg {String} yearId
     * The id of the year select box
     */
    yearId : null,
    /**
     * @cfg {String} monthId
     * The id of the month select box
     */
    monthId : null,
    /**
     * @cfg {String} dayId
     * The id of the day select box
     */
    dayId : null,
    /**
     * @cfg {Number} defaultYear
     * The default selected year
     */
    defaultYear: null,
    /**
     * @cfg {Number} defaultMonth
     * The default selected month
     */
    defaultMonth: null,  
    /**
     * @cfg {Number} defaultDay
     * The default selected day
     */  
    defaultDay: null,
     /**
     * @cfg {String} maxYear
     * The maxium year for select
     */  
    maxYear: null,
    /**
     * @cfg {String} maxYear
     * The minium year for select
     */  
    minYear: null,
    /**
     * @cfg {Array} months
     * The month display text
     */ 
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    
    init : function(){    
    	this.yearId = this.config.yearId;
    	this.monthId = this.config.monthId;
    	this.dayId = this.config.dayId;
    	if(this.config.months)this.months=this.config.months;
    	
    	var now = new Date();
    	this.defaultYear = this.config.defaultYear?this.config.defaultYear:now.getFullYear();
    	this.defaultMonth = this.config.defaultMonth?this.config.defaultMonth:(now.getMonth()+1);
    	this.defaultDay = this.config.defaultDay?this.config.defaultDay:now.getDate();    	
    	this.maxYear = this.config.maxYear?this.config.maxYear:(now.getFullYear()+10) ;   
    	this.minYear = this.config.minYear?this.config.minYear:(now.getFullYear()-10) ;      	
  	    	    
    	var yearEle = document.getElementById(this.yearId);
    	if(yearEle){		    	
	    	yearEle.onchange = this.checkDay.bind(this); 
	   		this.populateYears(this.defaultYear);
   		}    		   		
   		
   		if(this.monthId){	
	    	var monthSelectEle = document.getElementById(this.monthId);	    	
	   		monthSelectEle.selectedIndex = (this.defaultMonth && this.defaultMonth > 1)?(this.defaultMonth-1):0;   	   		
	   		monthSelectEle.onchange = this.checkDay.bind(this); 
	   		this.populateMonth(this.defaultMonth);
   		}     		   
   		     		    		  
   		this.populateDay(this.defaultDay);
    },
    
    isLeap: function(year) {
		return (year % 4 == 0)? (year % 100 == 0)? (year % 400 == 0)? true:false:true:false;
	},

	populateYears: function(year) {

		var yearSelectEle = document.getElementById(this.yearId);
		if(yearSelectEle){
			yearSelectEle.options.length=0;
			for (var i=0,j=this.maxYear; j > this.minYear ; i++, j--)
			{
				var y= String(j);
				yearSelectEle.options[i] = new Option(y,y);	
				if(	year && year == j){
					yearSelectEle.selectedIndex = i;						
				}
			}
		}
		
	},
	
	populateMonth: function(month) {
		
		var monthSelectEle = document.getElementById(this.monthId);
		
		if(monthSelectEle){
			monthSelectEle.options.length=0;
			for (var i=0; i <12 ; i++)
			{
				var m= this.months[i];
				monthSelectEle.options[i] = new Option(m,i+1);	
				if(	month && month == i+1){
					monthSelectEle.selectedIndex = i;						
				}
			}
		}
		
	},
	
	getMaxDay: function(year, month){
		var maxDay = 30;
		if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
			maxDay = 31;
		}else if( month == 2){
			if(this.isLeap(year)){
				maxDay = 29;
			}else{
				maxDay = 28;
			}
		}
		return maxDay;
	},
	
	checkDay: function() {

		var yearSelectEle = document.getElementById(this.yearId);
		var monthSelectEle = document.getElementById(this.monthId);
		var daySelectEle = document.getElementById(this.dayId);
		
		var year = yearSelectEle?yearSelectEle.value:0;	
		var month = monthSelectEle.value;	
		var day = daySelectEle.value;	
		
		var maxDay = this.getMaxDay(year, month);
		if(day > maxDay){				
			day = 0;						
		}
		this.populateDay(day);	
								
	},
	
	populateDay: function(day) {
	
		var yearSelectEle = document.getElementById(this.yearId);
		var monthSelectEle = document.getElementById(this.monthId);		
		var year = yearSelectEle?yearSelectEle.value:0;	
		var month = monthSelectEle.value;	
		var maxDay = this.getMaxDay(year, month);
		var daySelectEle = document.getElementById(this.dayId);		
	
		if(daySelectEle){
			daySelectEle.options.length=0;			
			for (var i=0; i < maxDay ; i++)
			{
				var d= String(i+1);
				daySelectEle.options[i] = new Option(d,d);						
			}
			daySelectEle.selectedIndex = (day && day > 1)?(day-1):0;	
		}	
		
		//Forcing Safari to Re-render the select box option list
		if(this.isSafari()){
			daySelectEle.parentNode.style.display='none';
			setTimeout(function(){
				document.getElementById(this.dayId).parentNode.style.display='inline';
			}.bind(this),1);
		}		
	
	},
	
	isSafari: function(){
		var ua = navigator.userAgent.toLowerCase();
		return (/webkit|khtml/).test(ua);
	}
 
};  