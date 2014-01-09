<?php
require_once "header.php";

$pageContent = '
<div id="prefabs" style="display: none; overflow: hidden;">
    <div id="cell">
        <div class="cell round-border-3"></div>
        <div class="chip round-border-50"></div>
        <div class="blocker"></div>
        
        <div class="tooltip">
            <input type="checkbox" id="activeCellFlag" checked="checked" />
            <label class="activeCellLabel css-hovered">Активная ячейка</label>
            <br/>
            
            <select id="ttBlocker">
                <option selected value=1>Обычная</option>
                <option value=2>Цепь</option>
                <option value=3>Двойная цепь</option>
                <option value=4>Обертка</option>
                <option value=5>Двойная обертка</option>
            </select>
            <br/>
            
            <select id="ttChip">
                <option selected value=0>---</option>
                <option value=1>Red</option>
                <option value=2>Green</option>
                <option value=3>Blue</option>
                <option value=4>Yellow</option>
                <option value=5>Orange</option>
                <option value=6>Purple</option>
            </select>
            <br/>
            
            <select id="ttBonus">
                <option selected value=0>---</option>
                <option value=1>Горизонтальный</option>
                <option value=2>Вертикальный</option>
                <option value=3>Разноцветный</option>
            </select>
            <br/><hr/>
            
            <button>Ок</button>
        </div>
    </div>
</div>

<div style="padding: 5px;">
    Входная матрица значений (может буть пустой), которую можно загрузить кнопкой "Загрузить"<br/>
    <textarea id="inputGrid"></textarea>
    <br/>
    
    Строк: <input id="rowCount" type="text" maxlength="1" style="width: 30px;" value="9" />
    Столбцов: <input id="colCount" type="text" maxlength="1" style="width: 30px;" value="9" />
    &nbsp;&nbsp;
    <button id="loadGridButton">Загрузить</button>&nbsp;&nbsp;
    <button id="resetGridButton">Сбросить</button>&nbsp;&nbsp;
    <span id="gridLineInfo"></span>
</div>

<br/>

<div id="grid">
    <table id="gridTable" cellspacing="0" cellpadding="0">
    </table>
</div>

&nbsp;&nbsp;
Результат:<br>
<textarea id="resultGrid" class="round-border-3" readonly></textarea>';

require_once "footer.php";
?>