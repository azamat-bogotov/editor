var grid = {
    "rowCount": 9,
    "colCount": 9
};

var canTooltipClose = false;

var BlockerType = {
    NORMAL: 1,
    CHAIN:  2,
    CHAIN2: 3,
    WRAP:   4,
    WRAP2:  5
};

var ChipType = {
    RED:    1,
    GREEN:  2,
    BLUE:   3,
    YELLOW: 4,
    ORANGE: 5,
    PURPLE: 6
};

var BonusType = {
    HORIZONTAL: 1,
    VERTICAL: 2,
    SOME_TYPE: 3
};

function ajaxExec(action, methodType, resType, data_, resFunc)
{
    if (resType == "text") {
        jQuery.ajax({
            url: action,
            type: methodType.toUpperCase(),
            data: data_,
            dataType: "text",
            complete: resFunc
        });
    } else {
        jQuery.ajax({
            url: action,
            type: methodType.toUpperCase(),
            data: data_,
            dataType: "json",
            success: resFunc
        });
    }
}

function getRandom(minVal, maxVal)
{
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

function fixRound(val, sign)
{
	if (sign <= 0) {
		return Math.ceil(val);
	}

	var k = 1;

	for (var i = 0; i < sign; i++) {
		k *= 10;
	}

	return Math.floor(val * k) / k;
}

function lTrim(val)
{
    var ptrn = /\s*((\S+\s*)*)/;
    return val.replace(ptrn, "$1");
}

function rTrim(val)
{
    var ptrn = /((\s*\S+)*)\s*/;
    return val.replace(ptrn, "$1");
}

function trim(val)
{
    return lTrim(rTrim(val));
}

function onGridResize()
{
    grid.rowCount = parseInt($("#rowCount").val(), 10);
    grid.colCount = parseInt($("#colCount").val(), 10);
    
    initGrid(grid.rowCount, grid.colCount);
    //resizeGrid(grid.rowCount, grid.colCount);
    updateCellHovered();
    buildResult();
}

function initGrid(rowCount, colCount)
{
    $("#gridTable").empty();
    
    var cell   = $("#prefabs #cell").html();
    var content = '', i, j;
    
    for (i = 0; i < rowCount; i++) {
        content += '<tr valign="top">';
        
        for (j = 0; j < colCount; j++) {
            content += '<td id="cellItem_' + i + "_" + j + '">' + cell + '</td>';
        }
        
        content += '</tr>';
    }
    
    $("#gridTable").html(content);
}

function resizeGrid()
{
    //
}

function loadGrid()
{
    var inputLine = $("#inputGrid").val();
    var items = inputLine.split(',');
    
    if (items.length <= 0 || items.length != grid.rowCount * grid.colCount) {
        $("#gridLineInfo").html("Размер матрицы не соответствует количеству элементов во входной строке");
    }
    
    var blockerType;
    var chipType;
    var bonusType;
    
    initGrid(grid.rowCount, grid.colCount);
    
    for (var k = 0; k < items.length; k++) {
        var i    = Math.floor(k / grid.colCount);
        var j    = k % grid.colCount;
        var item = parseInt(trim(items[k]), 10);
        
        if (item === undefined || typeof item !== "number" || isNaN(item)) {
            continue;
        }
        
        var cell = $("#gridTable #cellItem_" + i + "_" + j);
        
        if (cell.length <= 0) {
            continue;
        }
        
        blockerType = item & 0xFF;
        chipType    = (item >> 8) & 0xF;
        bonusType   = (item >> 12) & 0xF;
        
        if (blockerType <= 0) {
            $(cell).find(".tooltip #activeCellFlag")[0].checked = false;
            $(cell).find(".cell").parent().addClass("cell-none");
        } else {
            $(cell).find(".tooltip #ttBlocker").val(blockerType);
            
            if (blockerType > 1) {
                $(cell).find(".blocker").addClass("blocker-" + blockerType);
            }
            
            if (chipType > 0) {
                $(cell).find(".tooltip #ttChip").val(chipType);
                
                if (bonusType > 0) {
                    $(cell).find(".tooltip #ttBonus").val(bonusType);
                }
                
                if (bonusType == BonusType.SOME_TYPE) {
                    $(cell).find(".chip").addClass("chip-0");
                } else {
                    $(cell).find(".chip").addClass("chip-" + chipType + ((bonusType > 0) ? bonusType : ""));
                }
            }
        }
    }
    
    updateCellHovered();
    buildResult();
}

function buildResult()
{
    if (grid.rowCount <= 2 || grid.colCount <= 2) {
        $("#gridLineInfo").html("Число строк или столбцов не может быть меньше 3-х");
        return;
    }
    
    var result = "";
    
    $("#gridTable .tooltip").each(function() {
        if ($(this).find("#activeCellFlag").filter(":checked").length > 0) {
            var blockerType = parseInt($(this).find("#ttBlocker").val(), 10);
            var chipType    = parseInt($(this).find("#ttChip").val(), 10);
            var bonusType   = parseInt($(this).find("#ttBonus").val(), 10);
            
            result += "," + (blockerType | (chipType << 8) | (bonusType << 12));
        } else {
            result += ",0";
        }
    });
    
    if (result != "") {
        result = result.substring(1, result.length);
    }
    
    $("#resultGrid").val(result);
}

function updateCellHovered()
{
    $(".cell").mouseover(function() {
        $(this).addClass("cell-hovered");
    }).mouseout(function() {
        $(this).removeClass("cell-hovered");
    });
    
    $(".blocker, .chip").mouseover(function() {
        var cell = $(this).parent().find(".cell")[0];
        
        if (!$(cell).hasClass("cell-hovered")) {
            $(cell).addClass("cell-hovered");
        }
    }).mouseout(function() {
        var cell = $(this).parent().find(".cell")[0];
        
        if ($(cell).hasClass("cell-hovered")) {
            $(cell).removeClass("cell-hovered");
        }
    });
    
    $("#gridTable td").click(function() {
        $("#gridTable .tooltip").hide(50);
        $(this).find(".tooltip").show(100);
    });
    
    $("#gridTable .tooltip").mouseover(function() {
        $("#gridTable td").unbind("click");
        canTooltipClose = false;
    }).mouseout(function() {
        $("#gridTable td").click(function() {
            $("#gridTable .tooltip").hide(200);
            $(this).find(".tooltip").show(100);
        });
        
        canTooltipClose = true;
    });
    
    $(".activeCellLabel").click(function() {
        $(this).parent().find("#activeCellFlag")[0].checked = !$(this).parent().find("#activeCellFlag")[0].checked;
        $(this).parent().parent().toggleClass("cell-none");
        buildResult();
    });
    
    $("#gridTable .tooltip #activeCellFlag").change(function() {
        $(this).parent().parent().toggleClass("cell-none");
        buildResult();
    });
    
    $("#gridTable .tooltip button").click(function() {
        $(this).parent().hide();
    });
    
    $("#gridTable .tooltip #ttBlocker").change(function() {
        setBlocker($(this).parent().parent().find(".blocker"), $(this).val());
        buildResult();
    });
    
    $("#gridTable .tooltip #ttChip").change(function() {
        setChip($(this).parent().parent().find(".chip"), 
                $(this).val(), 
                $(this).parent().find("#ttBonus").val());
        
        buildResult();
    });
    
    $("#gridTable .tooltip #ttBonus").change(function() {
        setChip($(this).parent().parent().find(".chip"),
                 $(this).parent().find("#ttChip").val(), 
                 $(this).val());
        
        buildResult();
    });
}

function setBlocker(blocker, blockerType)
{
    blockerType = parseInt(blockerType, 10);
    
    $(blocker).removeClass("blocker-2");
    $(blocker).removeClass("blocker-3");
    $(blocker).removeClass("blocker-4");
    $(blocker).removeClass("blocker-5");
    
    if (blockerType > 1) {
        $(blocker).addClass("blocker-" + blockerType);
    }
}

function setChip(chip, chipType, bonusType)
{
    chipType  = parseInt(chipType, 10);
    bonusType = parseInt(bonusType, 10);
    
    if ($(chip).hasClass("chip-0")) {
        $(chip).removeClass("chip-0");
    }
    
    for (var i = 1; i <= 6; i++) {
        if ($(chip).hasClass("chip-" + i)) {
            $(chip).removeClass("chip-" + i);
        }
        
        if ($(chip).hasClass("chip-" + i + "1")) {
            $(chip).removeClass("chip-" + i + "1");
        }
        
        if ($(chip).hasClass("chip-" + i + "2")) {
            $(chip).removeClass("chip-" + i + "2");
        }
    }
    
    if (bonusType > 0 && chipType <= 0) {
        chipType = ChipType.RED;
        $(chip).parent().find(".tooltip #ttChip").val(chipType);
    }
    
    if (chipType > 0) {
        if (bonusType == BonusType.SOME_TYPE) {
            $(chip).addClass("chip-0");
        } else {
            $(chip).addClass("chip-" + chipType + ((bonusType > 0) ? bonusType : ""));
        }
    }
}

$(function() {
    $(".css-hovered").mouseover(function(){$(this).addClass("css-hovered-hover");}).mouseout(function(){$(this).removeClass("css-hovered-hover");});
    $(".css-inhovered").mouseover(function(){$(this).addClass("css-inhovered-hover");}).mouseout(function(){$(this).removeClass("css-inhovered-hover");});
    $(".css-bordered").mouseover(function(){$(this).addClass("css-bordered-hover");}).mouseout(function(){ $(this).removeClass("css-bordered-hover"); });
    
    $("#gridTable").mouseover(function() {
        canTooltipClose = false;
    }).mouseout(function() {
        canTooltipClose = true;
    });
    
    $("body").click(function() {
        if (canTooltipClose) {
            $("#gridTable .tooltip").hide();
        }
    });
    
    $("#rowCount, #colCount").change(onGridResize);
    
    $("#resetGridButton").click(function() {
        initGrid(grid.rowCount, grid.colCount);
        updateCellHovered();
        buildResult();
    });
    
    $("#loadGridButton").click(loadGrid);
    
    grid.rowCount = parseInt($("#rowCount").val(), 10);
    grid.colCount = parseInt($("#colCount").val(), 10);
    
    initGrid(grid.rowCount, grid.colCount);
    updateCellHovered();
    buildResult();
});