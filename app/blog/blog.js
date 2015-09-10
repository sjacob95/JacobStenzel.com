'use strict';

angular.module('blog', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('blog', {
  	url: '/blog',
    controller: 'BlogCtrl'
  })
  .state('blog.entry',	{
  	url: '/:entry',
  	controller: 'BlogCtrl'
  });
}])

.controller('BlogCtrl', ['$scope', function($scope) {
  var self = this;
  var tzString = "America/New_York";

	var entry1 = {
		title: 'My Third Post',
		date: new Date(2015, 3, 16).getTime(),
		tags: ['gnomes', 'wibbly-wobbly'],
		content: ''
	};

  var entry2 = {
    title: 'This Just In!',
    date: new Date().getTime(),
    tags: ['important', 'wibbly-wobbly', 'music', 'site'],
    content: ''
  };

  var entry3 = {
    title: 'My Second Post',
    date: new Date(2015, 0, 18).getTime(),
    tags: ['important', 'wibbly-wobbly'],
    content: ''
  };

  var entry4 = {
    title: 'Hello World!',
    date: new Date(2014, 11, 27).getTime(),
    tags: ['wibbly-wobbly', 'coding', 'site', 'important'],
    content: ''
  };

  var blogEntries = [entry1, entry2, entry3, entry4];
  var tagWeights = {};
  var tagSizes = {};
  var yearMapping = {};
  var yearExpansion = {};
  var tagCountMax = 0;

  for (var i = 0; i < blogEntries.length; i++)
  {
    var blogEntry = blogEntries[i];
    for (var j = 0; j < blogEntry.tags.length; j++)
    {
      var tag = blogEntry.tags[j];
      if (tagWeights[tag] == null)
      {
        tagWeights[tag] = 1;
      }
      else
      {
        tagWeights[tag]++;
      }

      if (tagWeights[tag] > tagCountMax)
      {
        tagCountMax = tagWeights[tag];
      }
    }
    var postMoment = moment.tz(blogEntry.date, tzString);
    if (yearMapping[postMoment.year()] == null)
    {
      yearMapping[postMoment.year()] = {};
      yearExpansion[postMoment.year()] = false;
    }

    if (yearMapping[postMoment.year()][postMoment.month()] == null)
    {
      yearMapping[postMoment.year()][postMoment.month()] = 1;
    }
    else
    {
      yearMapping[postMoment.year()][postMoment.month()]++;
    }
  }

  for (var tag in tagWeights) {
    if (tagWeights.hasOwnProperty(tag))
    {
      var tagWeight = tagWeights[tag];
      if (tagWeight / tagCountMax >= 7/8)
      {
        tagSizes[tag] = '30px';
      }
      else if (tagWeight / tagCountMax >= 7/8)
      {
        tagSizes[tag] = '27.5px';
      }
      else if (tagWeight / tagCountMax >= 6/8)
      {
        tagSizes[tag] = '25px';
      }
      else if (tagWeight / tagCountMax >= 5/8)
      {
        tagSizes[tag] = '22.5px';
      }
      else if (tagWeight / tagCountMax >= 4/8)
      {
        tagSizes[tag] = '20px';
      }
      else if (tagWeight / tagCountMax >= 3/8)
      {
        tagSizes[tag] = '17.5px';
      }
      else if (tagWeight / tagCountMax >= 2/8)
      {
        tagSizes[tag] = '15px';
      }
      else if (tagWeight / tagCountMax >= 1/8)
      {
        tagSizes[tag] = '12.5px';
      }
      else
      {
        tagSizes[tag] = '10px';
      }
    }
  };

  self.blogFilterCondition = '';
	self.blogEntries = blogEntries;
  self.tagWeights = tagWeights;
  self.tagSizes = tagSizes;
  self.yearMapping = yearMapping;
  self.yearExpansion = yearExpansion;
  self.activeEntry;
  self.getFormattedDate = function(entry)
  {
    return moment.tz(entry.date, tzString).format("MMMM D, YYYY");
  };
  self.getPostCountFromYear = function(year)
  {
    var sum = 0;
    for (var month in yearMapping[year])
    {
      sum += yearMapping[year][month];
    }
    return sum;
  };
  self.getMonthString = function(monthNum)
  {
    switch(monthNum)
    {
      case '0':
        return "January";
      case '1':
        return "Febuary";
      case '2':
        return "March";
      case '3':
        return "April";
      case '4':
        return "May";
      case '5':
        return "June";
      case '6':
        return "July";
      case '7':
        return "August";
      case '8':
        return "September";
      case '9':
        return "October";
      case '10':
        return "November";
      case '11':
        return "December";
      default:
        return "";
    }
  };
  self.dateToMillis = function(year, day, month)
  {
    return (new Date(year, day, month)).getTime();
  };
  self.tagIsString = function()
  {
    return (typeof self.blogFilterCondition === 'string') && self.blogFilterCondition !== '';
  }
  self.tagIsNumber = function()
  {
    return (typeof self.blogFilterCondition === 'number');
  }
  self.tagToDateString = function() {
    return ((typeof self.blogFilterCondition === 'number') ? moment.tz(self.blogFilterCondition, tzString).format("MMMM YYYY") : '');
  }

  self.getFromSref = function (entry)  {
    return self.blogEntries.filter(function(obj)
    {
      return obj.date === entry;
    })[0];

  };

  $scope.$watch('$stateParams.entry', function(val) {
    if (val == undefined)
    {
      self.activeEntry = '';
    }
    else
    {
      var newEntry = self.getFromSref(val);
      self.activeEntry = newEntry;
    }
  });
}])

.filter('blogFilter', [function()  {
  return function(items, condition) {
    var filtered = [];
    if (condition === '')
    {
      return items;
    }
    else if (typeof condition === 'string')
    {
      items.forEach (function(item)
      {
        if (item.tags.indexOf(condition) >= 0)
        {
          filtered.push(item);
        }
      });
    }
    else if (typeof condition === 'number')
    {
      var checkDate = new Date(condition);
      var checkMonth = checkDate.getMonth();
      var checkYear = 1900 + checkDate.getYear();
      var startTime = (new Date(checkYear, checkMonth, 1)).getTime();
      var endTime = (new Date(checkMonth == 11 ? checkYear + 1 : checkYear, (checkMonth + 1) % 12, 1)).getTime();
      items.forEach (function(item)
      {
        if (item.date >= startTime && item.date < endTime)
        {
          filtered.push(item);
        }
      });
    }
    return filtered;
  }
}])