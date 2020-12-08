(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['heroCard'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subtitle") || (depth0 != null ? lookupProperty(depth0,"subtitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subtitle","hash":{},"data":data,"loc":{"start":{"line":2,"column":82},"end":{"line":2,"column":94}}}) : helper)))
    + " ";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"power") || (depth0 != null ? lookupProperty(depth0,"power") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"power","hash":{},"data":data,"loc":{"start":{"line":2,"column":157},"end":{"line":2,"column":166}}}) : helper)))
    + " ";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"brawn") || (depth0 != null ? lookupProperty(depth0,"brawn") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"brawn","hash":{},"data":data,"loc":{"start":{"line":2,"column":203},"end":{"line":2,"column":212}}}) : helper)))
    + " ";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tech") || (depth0 != null ? lookupProperty(depth0,"tech") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tech","hash":{},"data":data,"loc":{"start":{"line":2,"column":247},"end":{"line":2,"column":255}}}) : helper)))
    + " ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"hero-card\">\r\n    <div class=\"card-info\", data-name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":39},"end":{"line":2,"column":47}}}) : helper)))
    + "\", data-subtitle=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subtitle") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":65},"end":{"line":2,"column":102}}})) != null ? stack1 : "")
    + "\", data-attack=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"attack") || (depth0 != null ? lookupProperty(depth0,"attack") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"attack","hash":{},"data":data,"loc":{"start":{"line":2,"column":118},"end":{"line":2,"column":128}}}) : helper)))
    + "\", data-power=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"power") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":143},"end":{"line":2,"column":174}}})) != null ? stack1 : "")
    + "\", data-brawn=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"brawn") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":189},"end":{"line":2,"column":220}}})) != null ? stack1 : "")
    + "\", data-tech=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"tech") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":234},"end":{"line":2,"column":263}}})) != null ? stack1 : "")
    + "\">\r\n        <div class=\"card-image\">\r\n            <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"image") || (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data,"loc":{"start":{"line":4,"column":22},"end":{"line":4,"column":31}}}) : helper)))
    + "\">\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n";
},"useData":true});
})();