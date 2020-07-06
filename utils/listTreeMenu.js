var list_to_treemenu = function (list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
        map[list[i]._id] = i;
        list[i].children = [];
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent !== null && map[node.parent] !== undefined) {

            var node2 = {         //Because i need only _id,Title & childrens
                _id: node._id,
                parent: node.parent,
                Name: node.Name,
                categoryName: node.category ?  node.category.categoryName : '',
                categoryKey: node.categoryKey,
                linkUrl: node.linkUrl,
                outLink: node.outLink,
                category: node.category,
                order: node.order,
                active: node.active,
                position: node.position,
                createDate: node.createDate,
                editDate: node.editDate,
                createBy: node.createBy,
                editBy: node.editBy,
                createDate_dd_mm_yyyy: node.createDate_dd_mm_yyyy,
                editDate_dd_mm_yyyy: node.editDate_dd_mm_yyyy,
                createDateIso: node.createDateIso,
                editDateIso: node.editDateIso,
                children: node.children
            }
            list[map[node.parent]].children.push(node2); //You can push direct "node"                                    
        } else {
            var node2 = {
                _id: node._id,
                parent: node.parent,
                Name: node.Name,
                categoryName: node.category ?  node.category.categoryName : '',
                categoryKey: node.categoryKey,
                linkUrl: node.linkUrl,
                outLink: node.outLink,
                category: node.category,
                order: node.order,
                active: node.active,
                position: node.position,
                createDate: node.createDate,
                editDate: node.editDate,
                createBy: node.createBy,
                editBy: node.editBy,
                createDate_dd_mm_yyyy: node.createDate_dd_mm_yyyy,
                editDate_dd_mm_yyyy: node.editDate_dd_mm_yyyy,
                createDateIso: node.createDateIso,
                editDateIso: node.editDateIso,
                children: node.children
            }
            roots.push(node2); // chuyển thành tree node cha con            
        }
    }
    return roots;
}
module.exports.list_to_treemenu = list_to_treemenu;
