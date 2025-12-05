// 3x5 243 lines
var slotConfig3x5 = {
    slotTextColor : 0xFFEA31,   // text color

    symbolSizeY: 220,
    spinTime: 2000,             // time, milliseconds
    winShowTime: 3000,          // time, milliseconds
    winMessageTime: 2000,       // win message show time

    symbAnimFrameRate: 16,      // symbols animation frame rate
    frameWidth : 260,           // frame width
    frameHeight : 217,          // frame height

    lineColor : 0xFFEA31,       // line color

    lineBetMaxValue: 20,        // slot line bet maxvalue
    useWild: true,              // use wild flag, wild can be substitute for any symbol to create winning combinations (exclude first reel)
    wild: 'Wild',               // wild symbol name
    useScatter: true,           // use scatter flag
    scatter: 'Scatter',         // scatter functionality is not implemented in the current version 
    selectedLines: 'all',       //'all' / 'first' - selectad lines at start

    useWildInFirstPosition: false,              // substitute of the first symbol not allowed
    useLineBetMultiplier: true,                 // win multiplied by bet
    useLineBetFreeSpinMultiplier: false,        // free spins win multiplied by bet
    defaultCoins: 100000,                       // default player credit

    localOffsetX: 0,                            // x offset from center for all scene objects
    localOffsetY: 0,                            // y offset from center for all scene objects

    fonts: [
        {
            fontName: 'gameFont',
            filePNG: 'fonts/roboto_slab_b_32_0.png',
            fileXML: 'fonts/roboto_slab_b_32.xml'
        },
        {
            fontName: 'gameFont_1',
            filePNG: 'fonts/roboto_slab_b_32_1.png',
            fileXML: 'fonts/roboto_slab_b_32.xml'
        },
        {
            fontName: 'gameFont_2',
            filePNG: 'fonts/roboto_slab_m_24_1.png',
            fileXML: 'fonts/roboto_slab_m_24.xml'
        },
    ],

    sprites: [
        // common sprites 
        {
            fileName: 'SlotMachine_3x5.png',
            name: 'slot'
        },
        {
            fileName: 'ReelMaskTop_3x5.png',
            name: 'slotmasktop'
        },
        {
            fileName: 'ReelMaskBottom_3x5.png',
            name: 'slotmaskbottom'
        },
        {
            fileName: null,
            name: 'handle'
        },
        {
            fileName: null,
            name: 'handle_ball'
        },
        {
            fileName: 'ButtonPlus.png',
            name: 'button_plus'
        },
        {
            fileName: 'ButtonPlusHover.png',
            name: 'button_plus_hover'
        },
        {
            fileName: 'ButtonMinus.png',
            name: 'button_minus'
        },
        {
            fileName: 'ButtonMinusHover.png',
            name: 'button_minus_hover'
        },
        {
            fileName: null,
            name: 'lamp_off'
        },
        {
            fileName: 'PanelTotalBet.png',
            name: 'panel_totalbet'
        },
        {
            fileName: 'PanelWin.png',
            name: 'panel_win'
        },
        {
            fileName: 'PanelLines.png',
            name: 'panel_lines'
        },
        {
            fileName: 'PanelBalance.png',
            name: 'panel_balance'
        },
        {
            fileName: null,
            name: 'button_lines'
        },
        {
            fileName: null,
            name: 'button_lines_hover'
        },
        {
            fileName: 'ButtonMaxBet.png',
            name: 'button_maxbet'
        },
        {
            fileName: 'ButtonMaxBetHover.png',
            name: 'button_maxbet_hover'
        },
        {
            fileName: 'ButtonSpin.png',
            name: 'button_spin'
        },
        {
            fileName: 'ButtonSpinHover.png',
            name: 'button_spin_hover'
        },
        {
            fileName: 'ButtonAutoSpin.png',
            name: 'button_autospin'
        },
        {
            fileName: 'ButtonAutoSpinHover.png',
            name: 'button_autospin_hover'
        },
        {
            fileName: null,
            name: 'line_button'
        },
        {
            fileName: null,
            name: 'line_button_hover'
        },
        // common gui sprites 
        {
            fileName: 'ButtonMenu.png',
            name: 'button_menu'
        },
        {
            fileName: 'ButtonMenuHover.png',
            name: 'button_menu_hover'
        },
        {
            fileName: 'ButtonInfo.png',
            name: 'button_info'
        },
        {
            fileName: 'ButtonInfoHover.png',
            name: 'button_info_hover'
        },
        {
            fileName: 'ButtonSettings.png',
            name: 'button_settings'
        },
        {
            fileName: 'ButtonSettingsHover.png',
            name: 'button_settings_hover'
        },
        {
            fileName: 'ButtonRules.png',
            name: 'button_rules'
        },
        {
            fileName: 'ButtonRulesHover.png',
            name: 'button_rules_hover'
        },
        {
            fileName: 'gui/ButtonOn.png',
            name: 'button_on'
        },
        {
            fileName: 'gui/ButtonOff.png',
            name: 'button_off'
        },
        {
            fileName: 'gui/MessagePanel.png',
            name: 'message_panel'
        },   
        {
            fileName: 'gui/AboutPanel.png',
            name: 'about_panel'
        }, 
        {
            fileName: 'gui/AboutTitle.png',
            name: 'about_title'
        }, 
        {
            fileName: 'gui/SettingsPanel.png',
            name: 'settings_panel'
        }, 
        {
            fileName: 'gui/SettingsTitle.png',
            name: 'settings_title'
        },
        {
            fileName: 'gui/Logo.png',
            name: 'logo'
        }, 
        {
            fileName: 'gui/ExitButton.png',
            name: 'exit_button'
        }, 
        {
            fileName: 'gui/ExitButtonHover.png',
            name: 'exit_button_hover'
        },   
        {
            fileName: 'gui/MiddleButton.png', 
            name: 'middle_button'
        }, 
        {
            fileName: 'gui/MiddleButtonHover.png', 
            name: 'middle_button_hover'
        },   
        {
            fileName: 'gui/LongButton.png', 
            name: 'long_button'
        }, 
        {
            fileName: 'gui/LongButtonHover.png', 
            name: 'long_button_hover'
        }, 
        {
            fileName: 'gui/ExtraLongButton.png', 
            name: 'extralong_button'
        }, 
        {
            fileName: 'gui/ExtraLongButtonHover.png', 
            name: 'extralong_button_hover'
        },
        {
            fileName: 'gui/InfoPanel.png', 
            name: 'info_panel'
        },   
        {
            fileName: 'gui/popUpBkg.png', 
            name: 'pu_background'
        },   
        {
            fileName: 'gui/NextButtonHover.png', 
            name: 'next_button_hover'
        },
        {
            fileName: 'gui/NextButton.png', 
            name: 'next_button'
        },  
        {
            fileName: 'gui/PrevButtonHover.png', 
            name: 'prev_button_hover'
        },   
        {
            fileName: 'gui/PrevButton.png', 
            name: 'prev_button'
        },    
        {
            fileName: null, 
            name: 'minor_title'
        },   
        {
            fileName: null, 
            name: 'major_title'
        },  
        {
            fileName: null, 
            name: 'special_title'
        },    
        {
            fileName: null, 
            name: 'symbol_plate'
        },   
        {
            fileName: null, 
            name: 'specsymbol_plate'
        },   
        {
            fileName: null, 
            name: 'navi_dot'
        },    
        {
            fileName: null, 
            name: 'navi_dot_active'
        },    
    ],

    symbols:
    [
        {
            fileName: 'Gold.png',                   // filename or null
            name: 'Gold',                           // sprite name
            fileNameBlurred: 'GoldBlurred.png',     // blurry symbol file name, folder png/SymbolsBlurred
            animation: 'GoldSheet.png',             // animation sheet file name, folder png/SymbolsSheet
            useWildSubstitute: true                 // use wild substitute for the symbol
        },
        {
            fileName: 'Lantern.png',           
            name: 'Lantern',                   
            fileNameBlurred: 'LanternBlurred.png', 
            animation: 'LanternSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'Minecart.png',           
            name: 'Minecart',                   
            fileNameBlurred: 'MinecartBlurred.png', 
            animation: 'MinecartSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: '10.png',          
            name: '10',                   
            fileNameBlurred: '10Blurred.png', 
            animation: '10Sheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'A.png',          
            name: 'A',                   
            fileNameBlurred: 'ABlurred.png', 
            animation: 'ASheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'Pickaxe.png',          
            name: 'Pickaxe',                   
            fileNameBlurred: 'PickaxeBlurred.png', 
            animation: 'PickaxeSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'J.png',          
            name: 'J',                   
            fileNameBlurred: 'JBlurred.png', 
            animation: 'JSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'K.png',          
            name: 'K',                   
            fileNameBlurred: 'KBlurred.png', 
            animation: 'KSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'Q.png',          
            name: 'Q',                   
            fileNameBlurred: 'QBlurred.png', 
            animation: 'QSheet.png',
            useWildSubstitute: true
        },
        {
            fileName: 'Wild.png',          
            name: 'Wild',                   
            fileNameBlurred: 'WildBlurred.png', 
            animation: 'WildSheet.png',
            useWildSubstitute: false
        },
        {
            fileName: 'Scatter.png',          
            name: 'Scatter',                   
            fileNameBlurred: 'ScatterBlurred.png', 
            animation: 'ScatterSheet.png',
            useWildSubstitute: false
        }
    ],

    reels:[
        {//0
            symbolImages: ['Minecart', 'Pickaxe', 'J', 'Lantern', 'Q', 'Gold', '10', 'K', 'A', 'Gold'],                         // 10
            offsetX: -520,
            offsetY: -66,
            windowImage: 'reel',    // not used
            windowsCount: 3,    
            addSpinTime: 0, // additional spin time for reel milliseconds   
        },
        {//1
            symbolImages: ['Lantern', 'Gold', 'Wild', 'Minecart','Q', 'Pickaxe', 'J', 'Wild', 'K','A', '10', 'Gold'],               // 12
            offsetX: -260,
            offsetY: -66,
            windowImage: 'reel',        // not used
            windowsCount: 3,    
            addSpinTime: 100, // additional spin time for reel milliseconds   
        },
        { // 2
            symbolImages: ['Lantern', 'Wild', 'K', 'Minecart', 'Q', 'Gold', 'Pickaxe', 'J', 'Wild', 'Scatter', 'A', 'Wild', '10'],   // 13
            offsetX: 0,
            offsetY: -66,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 200, // additional spin time for reel milliseconds   
        },
        { // 3
            symbolImages: ['Minecart', 'Pickaxe', 'Wild', 'J', 'Q', 'Lantern', 'Wild', 'K', 'A', 'Wild', 'Scatter', 'Gold', 'Scatter', '10'],   // 14
            offsetX: 260,
            offsetY: -66,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 300, // additional spin time for reel milliseconds     
        },
        { // 4
            symbolImages: ['Gold', 'Wild', 'Lantern', 'Minecart', 'Pickaxe', 'J', 'Wild', 'Q', 'A', 'Wild', 'Scatter', 'K', 'Scatter' , '10'],   // 14
            offsetX: 520,
            offsetY: -66,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 400, // additional spin time for reel milliseconds     
        }
    ],

    // reels_simulate: [0, 0, -1, -1, -1], // -1 - avoid reel simulate

    payLines:[
        {
            line: ['Gold', 'Gold', 'Gold', 'Gold', 'Gold'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Gold', 'Gold', 'Gold', 'Gold', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Gold', 'Gold', 'Gold', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Lantern', 'Lantern', 'Lantern', 'Lantern', 'Lantern'],
            pay: 5,
            freeSpins: 0
        },
        {
            line: ['Lantern', 'Lantern', 'Lantern', 'Lantern', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Lantern', 'Lantern', 'Lantern', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Minecart', 'Minecart', 'Minecart', 'Minecart', 'Minecart'],
            pay: 6,
            freeSpins: 0
        },
        {
            line: ['Minecart', 'Minecart', 'Minecart', 'Minecart', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Minecart', 'Minecart', 'Minecart', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Pickaxe', 'Pickaxe', 'Pickaxe', 'Pickaxe', 'Pickaxe'],
            pay: 7,
            freeSpins: 0
        },
        {
            line: ['Pickaxe', 'Pickaxe', 'Pickaxe', 'Pickaxe', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Pickaxe', 'Pickaxe', 'Pickaxe', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['10', '10', '10', '10', '10'],
            pay: 8,
            freeSpins: 0
        },
        {
            line: ['10', '10', '10', '10', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['10', '10', '10', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['J', 'J', 'J', 'J', 'J'],
            pay: 17,
            freeSpins: 0
        },
        {
            line: ['J', 'J', 'J', 'J', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['J', 'J', 'J', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Q', 'Q', 'Q', 'Q', 'Q'],
            pay: 19,
            freeSpins: 0
        },
        {
            line: ['Q', 'Q', 'Q', 'Q', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['Q', 'Q', 'Q', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['K', 'K', 'K', 'K', 'K'],
            pay: 20,
            freeSpins: 0
        },
        {
            line: ['K', 'K', 'K', 'K', 'any'],
            pay: 14,
            freeSpins: 0
        },
        {
            line: ['K', 'K', 'K', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['A', 'A', 'A', 'A', 'A'],
            pay: 25,
            freeSpins: 0
        },
        {
            line: ['A', 'A', 'A', 'A', 'any'],
            pay: 15,
            freeSpins: 0
        },
        {
            line: ['A', 'A', 'A', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
    ],
    
    scatterPayTable:[
        {
            scattersCount: 5,
            pay: 0,
            freeSpins: 5
        }
    ],
    
    createSlotGraphic: function(scene){
        // scene.background =  scene.addSpriteLocPos('background', 0, 0); //?.setScale(1.5);
        // scene.background.depth = -5;

        // lamps
        /*
            scene.lampsArray = []; 
            scene.leftLamp = new Lamp (scene, -366, -490);
            scene.rightLamp = new Lamp (scene, 366, -490);
            scene.rightLamp.lamp.setScale(-1, 1); // mirror right lamp
            scene.lampsArray.push(scene.leftLamp);
            scene.lampsArray.push(scene.rightLamp);
            scene.leftLamp.on();
            scene.rightLamp.on();
        */
       
        // нужно добавить свои спрайты
         scene.slot =  scene.addSpriteLocPos('slot', 0, -70); 
         scene.slot.depth = -1;
         scene.slot =  scene.addSpriteLocPos('slotmasktop', 0, -410); 
         scene.slot =  scene.addSpriteLocPos('slotmaskbottom', 0, 260); 

         scene.totalbetPanel = scene.addSpriteLocPos('panel_totalbet', -370, 225 + 220); 
         scene.linesPanel = scene.addSpriteLocPos('panel_lines', -650, 225 + 220); 
         scene.balancePanel = scene.addSpriteLocPos('panel_balance', 370, 225 + 220); 
         scene.winPanel = scene.addSpriteLocPos('panel_win', 650, 225 + 220); 
    },

    createReels: function(scene) {
        var _reels = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            _reels.push(new Reel(scene, this.reels[ri], ri, this.symbolSizeY, this.reels[ri].windowsCount, false, this.spinTime, this.symbAnimFrameRate));
        }
        return _reels;
    },

    createControls: function(scene, slotControls) {
        // totalbet minus button
        slotControls.totalBetMinusButton = new SceneButton(scene, 'button_minus','button_minus_hover', false);   
        slotControls.buttons.push(slotControls.totalBetMinusButton);
        slotControls.totalBetMinusButton.create(-370-95, 215 + 220, 0.5, 0.5);
        slotControls.totalBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);

        // totalbet plus button
        slotControls.totalBetPlusButton = new SceneButton(scene, 'button_plus','button_plus_hover', false);   
        slotControls.buttons.push(slotControls.totalBetPlusButton);
        slotControls.totalBetPlusButton.create(-370 + 95, 215 + 220, 0.5, 0.5);
        slotControls.totalBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);

        // maxbet button
        slotControls.slotMaxBetButton = new SceneButton(scene, 'button_maxbet', 'button_maxbet_hover', false);   
        slotControls.buttons.push(slotControls.slotMaxBetButton);
        slotControls.slotMaxBetButton.create(-100, 245 + 200, 0.5, 0.5);
        slotControls.slotMaxBetButton.addClickEvent(slotControls.maxBet_Click, slotControls);     
         
        // autoSpin button
        slotControls.slotAutoSpinButton = new SceneButton(scene, 'button_autospin', 'button_autospin_hover', false); 
        slotControls.buttons.push(slotControls.slotAutoSpinButton);
        slotControls.slotAutoSpinButton.create(100, 245 + 200, 0.5, 0.5);
        slotControls.slotAutoSpinButton.button.setVisible(true);   

        // spin button
        slotControls.slotSpinButton = new SpinButton(scene, 'button_spin', 'button_spin_hover', false);   
        slotControls.buttons.push(slotControls.slotSpinButton);
        slotControls.slotSpinButton.create(0, 225 + 200, 0.5, 0.5);    
        slotControls.slotSpinButton.clickEvent.add(scene.handleAnimation, scene);  

        // menu button
        slotControls.menuButton = new SceneButton(scene, 'button_menu', 'button_menu_hover', false);   
        slotControls.buttons.push(slotControls.menuButton);
        slotControls.menuButton.create(860, -400, 0.5, 0.5);
        slotControls.menuButton.addClickEvent(()=>{ 
            console.log('menu click');
            slotControls.settingsButton.button.setVisible(!slotControls.settingsButton.button.visible);  
            slotControls.rulesButton.button.setVisible(!slotControls.rulesButton.button.visible); 
            slotControls.slotInfoButton.button.setVisible(!slotControls.slotInfoButton.button.visible); 
            scene.soundController.playClip('button_click');}, this);
        slotControls.menuButton.button.setVisible(true); 

        // settings button
        slotControls.settingsButton = new SceneButton(scene, 'button_settings', 'button_settings_hover', false);   
        slotControls.buttons.push(slotControls.settingsButton);
        slotControls.settingsButton.create(860, -300, 0.5, 0.5);
        slotControls.settingsButton.addClickEvent(()=>{ 
            console.log('settings click');
            var pu = scene.guiController.showPopUp(this.createSettingsPUHandler);
            scene.soundController.playClip('button_click');}, this);
        slotControls.settingsButton.button.setVisible(false);  

        // sound button
        //slotControls.soundButton = new SceneButton(scene, 'button_on', 'button_off', true);   
        //slotControls.buttons.push(slotControls.soundButton);
        //slotControls.soundButton.create(-860, -300, 0.5, 0.5);
        //slotControls.soundButton.addClickEvent(()=>{scene.soundController.soundOn(!scene.soundController._soundOn);}, scene);
        //slotControls.soundButton.button.setVisible(true); 

        // lines loop button
        // slotControls.slotLinesLoopButton = new SceneButton(scene, 'button_lines', 'button_lines_hover', false);   
        // slotControls.buttons.push(slotControls.slotLinesLoopButton);
        // slotControls.slotLinesLoopButton.create(-360, 225, 0.5, 0.5);
        // slotControls.slotLinesLoopButton.addClickEvent(slotControls.linesLoop_Click, slotControls);

       // rules button
       slotControls.rulesButton = new SceneButton(scene, 'button_rules', 'button_rules_hover', false);   
       slotControls.buttons.push(slotControls.rulesButton);
       slotControls.rulesButton.create(860, -200, 0.5, 0.5);
       slotControls.rulesButton.addClickEvent(()=>{
           var pu = scene.guiController.showPopUp(this.createInfoPUHandler);
           scene.soundController.playClip('button_click');
       }, this);   
       slotControls.rulesButton.button.setVisible(false); 

       // info button
       slotControls.slotInfoButton = new SceneButton(scene, 'button_info', 'button_info_hover', false);   
       slotControls.buttons.push(slotControls.slotInfoButton);
       slotControls.slotInfoButton.create(860, -100, 0.5, 0.5);
       slotControls.slotInfoButton.addClickEvent(()=>{
            console.log('info click');
           var pu = scene.guiController.showPopUp(this.createAboutPUHandler);
           scene.soundController.playClip('button_click');
       }, this);   
       slotControls.slotInfoButton.button.setVisible(false); 


        // adding the text fields
        slotControls.linesText = scene.add.bitmapText(scene.centerX - 650, scene.centerY + 165 + 220, 'gameFont_2', 'LINES', 30, 1).setOrigin(0.5);
        slotControls.linesCountText = scene.add.bitmapText(scene.centerX - 652, scene.centerY + 215 + 220, 'gameFont_1', slotControls.selectedLinesCount, 43, 1).setOrigin(0.5);
        // todel slotControls.slotLinesLoopButton.pointerDownEvent.add(()=>{slotControls.linesCountText.setPosition(slotControls.linesCountText.x, scene.centerY + 212);});
        // todel slotControls.slotLinesLoopButton.pointerUpEvent.add(()=>{slotControls.linesCountText.setPosition(slotControls.linesCountText.x, scene.centerY + 200);});
 
        slotControls.lineBetAmountText = scene.add.bitmapText(scene.centerX - 420, scene.centerY + 215 + 220, 'gameFont_1', slotControls.lineBet, 43, 1).setOrigin(0.5);
        slotControls.lineBetAmountText.setVisible(false);
        // todel slotControls.slotLineBetLoopButton.pointerDownEvent.add(()=>{slotControls.lineBetAmountText.setPosition(slotControls.lineBetAmountText.x, scene.centerY + 212);});
        // todel slotControls.slotLineBetLoopButton.pointerUpEvent.add(()=>{slotControls.lineBetAmountText.setPosition(slotControls.lineBetAmountText.x, scene.centerY + 200);});
 
        slotControls.totalBetText = scene.add.bitmapText(scene.centerX - 370, scene.centerY + 165 + 220, 'gameFont_2', 'TOTAL  BET', 30, 1).setOrigin(0.5);
        // slotControls.totalBetText.tint = this.slotTextColor;
  
        slotControls.totalBetSumText = scene.add.bitmapText(scene.centerX - 370, scene.centerY + 215 + 220, 'gameFont_1', slotControls.getTotalBet(), 43, 1).setOrigin(0.5);
        // slotControls.totalBetSumText.tint = this.slotTextColor;
 
        slotControls.creditText = scene.add.bitmapText(scene.centerX + 370, scene.centerY + 165 + 220, 'gameFont_2', 'BALANCE', 30, 1).setOrigin(0.5);
        // slotControls.creditText.tint = this.slotTextColor;

        slotControls.creditSumText = scene.add.bitmapText(scene.centerX + 370, scene.centerY + 215 + 220, 'gameFont_1', '$' + scene.slotPlayer.coins, 43, 1).setOrigin(0.5);
        // slotControls.creditSumText.tint = this.slotTextColor;
         
        slotControls.winText = scene.add.bitmapText(scene.centerX + 650, scene.centerY + 165 + 220, 'gameFont_2', 'YOUR  WIN', 30, 1).setOrigin(0.5);

        slotControls.winAmountText = scene.add.bitmapText(scene.centerX + 650, scene.centerY + 215 + 220, 'gameFont_1', '0', 43, 1).setOrigin(0.5);
        // slotControls.winAmountText.tint = this.slotTextColor;
        // slotControls.winAmountText.setVisible(false);
 
        slotControls.autoSpinText = scene.add.bitmapText(scene.centerX + 125, scene.centerY + 235 + 200, 'gameFont_1', 'AUTO\nSPIN', 33, 1).setOrigin(0.5);
        slotControls.maxBetText = scene.add.bitmapText(scene.centerX - 125, scene.centerY + 235 + 200, 'gameFont_1', 'MAX\nBET', 33, 1).setOrigin(0.5);
        slotControls.spinText = scene.add.bitmapText(scene.centerX - 0, scene.centerY + 230 + 200, 'gameFont_1', 'SPIN', 52, 1).setOrigin(0.5);

        slotControls.infoText = scene.add.bitmapText(scene.centerX, scene.centerY + 400 + 200, 'gameFont', 'info', 30, 1).setOrigin(0.5);
        slotControls.infoText.tint = this.slotTextColor;
        slotControls.infoText.setVisible(false);
 
        slotControls.freeSpinCountText = scene.add.bitmapText(scene.centerX, scene.centerY + 360 + 200, 'gameFont_1', '9999', 30, 1).setOrigin(0.5);
        slotControls.freeSpinCountText.tint = this.slotTextColor;
        slotControls.freeSpinCountText.setVisible(false);
    },

    createInfoPUHandler: function(popup)
    {
        function createSymbolPlate5x (popup, parentContainer, symbSpriteName, posX, posY, price3x,price4x, price5x)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(-140, 0, symbSpriteName).setOrigin(0.5).setScale(0.8);
            symbContainer.add(symbIcon);
    
            let textXPos = -20;
            let text3x = popup.scene.add.bitmapText(textXPos, 48, 'gameFont_1', '3x - ' + price3x, 43, 1).setOrigin(0, 0.5);
            symbContainer.add(text3x);
    
            let text4x = popup.scene.add.bitmapText(textXPos, 0, 'gameFont_1', '4x - ' + price4x, 43, 1).setOrigin(0, 0.5);
            symbContainer.add(text4x);

            let text5x = popup.scene.add.bitmapText(textXPos, -48, 'gameFont_1', '5x - ' + price5x, 43, 1).setOrigin(0, 0.5);
            symbContainer.add(text5x);
        };

        function createSpecSymbolPlate(popup, parentContainer, symbSpriteName, posX, posY, info)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(0, 0, symbSpriteName).setOrigin(0.5, 1).setScale(0.8);
            symbContainer.add(symbIcon);
    
            let textInfo = popup.scene.add.bitmapText(160, 0, 'gameFont_1', info, 43, 0).setOrigin(0, 1);
            symbContainer.add(textInfo);
        };
    
        function refreshInfoPu (containers, selectors, index)
        {
            for(let i = 0; i < containers.length; i++)
            {
                containers[i].visible = (index === i);
                if(popup.scene.textures.exists('navi_dot_active') && popup.scene.textures.exists('navi_dot'))
                {
                    selectors[i].setTexture((index === i) ? 'navi_dot_active' : 'navi_dot');
                }
            }
        };

        let index = 0;
        let containers = [];
        let selectors = [];
        let offsetY = -70;

        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + offsetY, 'pu_background').setOrigin(0.5).setScale(1);
        backGround.setInteractive(); // block bottom controls
        // backGround.setAlpha(0.05);
        // backGround.tint = 0x262a3a;
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, 0 + offsetY, 'info_panel').setOrigin(0.5);
        popup.add(panel);

        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 715, -350 + offsetY);
        popup.addButton('nextButton','next_button', 'next_button_hover', false, 80, 440 + offsetY);
        popup.addButton('prevButton','prev_button', 'prev_button_hover', false, -80, 440 + offsetY);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['nextButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['prevButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        popup['nextButton'].clickEvent.add(()=>
        {
            if(index < containers.length - 1) index++;
            else index = 0;
            refreshInfoPu(containers, selectors, index);
        }, this);

        popup['prevButton'].clickEvent.add(()=>
        {
            if(index > 0) index--;
            else index = containers.length - 1;
            refreshInfoPu(containers, selectors, index);
        }, this);

        // create minor symbols panel
        let minorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(minorContainer);
        popup.add(minorContainer);
        // let minorTitle =  popup.scene.add.sprite(0, -305, 'minor_title').setOrigin(0.5); // image
        let minorTitle = popup.scene.add.bitmapText(0, -280, 'gameFont_2', 'MINOR  SYMBOLS', 50, 1).setOrigin(0.5); // text
        minorContainer.add(minorTitle);

        let row1Y = -130;
        let row2Y = row1Y + 270;
        let col1X = -350;
        let colDist = 410;
        let col2X = col1X + colDist;
        let col3X = col2X + colDist;

        // minor row 1
        createSymbolPlate5x(popup, minorContainer, 'Gold',  col1X , row1Y, 1, 2, 3);
        createSymbolPlate5x(popup, minorContainer, 'Lantern', col2X , row1Y, 1, 3, 5);
        createSymbolPlate5x(popup, minorContainer, 'Minecart', col3X , row1Y, 2, 3, 6);

        // minor row 2
        createSymbolPlate5x(popup, minorContainer, 'Pickaxe', col1X + 0.5 * colDist, row2Y, 2, 3, 7);
        createSymbolPlate5x(popup, minorContainer, '10', col2X + 0.5 * colDist, row2Y, 2, 3, 8);
        minorContainer.visible = false;

        // create major symbols panel
        let majorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(majorContainer);
        popup.add(majorContainer);
        // let majorTitle =  popup.scene.add.sprite(0, -305, 'major_title').setOrigin(0.5); // image
        let majorTitle = popup.scene.add.bitmapText(0, -280, 'gameFont_2', 'MAJOR  SYMBOLS', 50, 1).setOrigin(0.5); // text
        majorContainer.add(majorTitle);

        // major row 1
        createSymbolPlate5x(popup, majorContainer , 'J', col1X + 0.5 * colDist, row1Y, 11, 13, 17);
        createSymbolPlate5x(popup, majorContainer , 'Q', col2X + 0.5 * colDist, row1Y, 11, 13, 19);

        // major row 2
        createSymbolPlate5x(popup, majorContainer , 'K', col1X + 0.5 * colDist, row2Y, 11, 14, 20);
        createSymbolPlate5x(popup, majorContainer , 'A', col2X + 0.5 * colDist, row2Y, 11, 15, 25);
        majorContainer.visible = false;

        // create special symbols panel
        let specialContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(specialContainer);
        popup.add(specialContainer);
        // let specialTitle =  popup.scene.add.sprite(0, -305, 'special_title').setOrigin(0.5); // image
        let specialTitle = popup.scene.add.bitmapText(0, -280, 'gameFont_2', 'SPECIAL  SYMBOLS', 50, 1).setOrigin(0.5); // text
        specialContainer.add(specialTitle);
    
        // special row 1
        createSpecSymbolPlate(popup, specialContainer, 'Wild', -300, -30, 'Wild can be used with any symbols \non the reels to create winning \ncombinations (exclude first reel).');
        createSpecSymbolPlate(popup, specialContainer, 'Scatter', -300 , 240, 'Any 5 scatter on the screen \ngive the player  5 free spins.');
        specialContainer.visible = false;

        // create rules panel
        let rulesContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(rulesContainer);
        popup.add(rulesContainer);
        let rulesTitle = popup.scene.add.bitmapText(0, -280, 'gameFont_2', 'RULES', 50, 1).setOrigin(0.5); // text
        rulesContainer.add(rulesTitle);

        let aboutTitle = popup.scene.add.bitmapText(-570, -200, 'gameFont_2', 'ABOUT  THE  GAME', 33, 0).setOrigin(0,0.5); // text
        rulesContainer.add(aboutTitle);
        let aboutText = popup.scene.add.bitmapText(-570, -150, 'gameFont_1',
        'Full Slot is a pack of Slot Games with 3-5 reels and 20 paylines oriented from left to right. \nThe games have 8 regular symbols that win if three or more are lined up in sequence on \na payline, beginning from the leftmost position. The 6 high pay symbols and the 2 low \npay symbols.', 33, 0).setOrigin(0, 0); // text
        rulesContainer.add(aboutText);


        let howTitle = popup.scene.add.bitmapText(-570, 100, 'gameFont_2', 'HOW  TO  PLAY', 33, 0).setOrigin(0,0.5); // text
        rulesContainer.add(howTitle);
        let howText = popup.scene.add.bitmapText(-570, 150, 'gameFont_1',
        '- Place your bet \n- Press the Spin button to start game \n- You can also use Max Bet button to auto bet \n- Press the AutoSpin button to turn Auto Spin game mode', 33, 0).setOrigin(0, 0); // text
        rulesContainer.add(howText);

        // create navi selectors
        let dotDist = 50;
        let offsetDots = dotDist * (containers.length - 1) / 2;
        if(popup.scene.textures.exists('navi_dot_active') && popup.scene.textures.exists('navi_dot'))
        {
            for(let i = 0; i < containers.length; i++)
            {
                var selector = popup.scene.add.sprite(-offsetDots + i * dotDist, 440 + offsetY, 'navi_dot').setOrigin(0.5);
                selectors.push(selector);
                popup.add(selector);
            }
        }
        refreshInfoPu(containers, selectors, index);
    },

    createAboutPUHandler: function(popup)
    {       
        let yOffset = 0;
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0, 'pu_background').setOrigin(0.5).setScale(1);
        backGround.setInteractive(); // block bottom controls
        // backGround.tint = 0x262a3a;
        // backGround.setAlpha(0.05);
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'about_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        let title = popup.scene.add.sprite(0, -330 + yOffset, 'about_title').setOrigin(0.5);
        popup.add(title);

        // add logo
        let logo = popup.scene.add.sprite(0, -70 + yOffset, 'logo').setOrigin(0.5);
        popup.add(logo);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 130 + yOffset, 'gameFont_2', 'NEED HELP?', 33, 1).setOrigin(0.5);
        popup.messageText.tint = 0xFFFFFF;
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('supportButton','long_button', 'long_button_hover', false, 0, 222 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 255, -260  + yOffset);

        popup['supportButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['supportButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // add support button text
        popup.supText = popup.scene.add.bitmapText(0, 212+ yOffset, 'gameFont_1', 'SUPPORT', 43, 1).setOrigin(0.5);
        popup.supText.tint = 0xFFFFFF;
        popup.add(popup.supText);
    },

    createSettingsPUHandler: function(popup)
    {    
        let yOffset = 0;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0, 'pu_background').setOrigin(0.5).setScale(1);
        backGround.setInteractive(); // block bottom controls
        // backGround.tint = 0x262a3a;
        // backGround.setAlpha(0.5);
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'settings_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        let title = popup.scene.add.sprite(0, -305 + yOffset, 'settings_title').setOrigin(0.5);
        popup.add(title);

        // sound and music text
        popup.soundText = popup.scene.add.bitmapText(-105, -145 + yOffset, 'gameFont_2', 'SOUNDS', 33, 1).setOrigin(0.5);
        popup.soundText.tint = 0xFFFFFF;
        popup.add(popup.soundText);

        popup.musicText = popup.scene.add.bitmapText(105, -145 + yOffset, 'gameFont_2', 'MUSIC', 33, 1).setOrigin(0.5);
        popup.musicText.tint = 0xFFFFFF;
        popup.add(popup.musicText);

        // sound and music buttons
        popup.addButton('soundButton','button_on', 'button_off', true, -105, -57 + yOffset);
        popup.addButton('musicButton','button_on', 'button_off', true, 105, -57 + yOffset);

        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.soundOn(!popup.scene.soundController._soundOn);}, popup);
        if(!popup.scene.soundController._soundOn) popup['soundButton'].setPressed();

        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.musicOn(!popup.scene.soundController._musicOn);}, popup);
        if(!popup.scene.soundController._musicOn) popup['musicButton'].setPressed();

        // privacy ant terms buttons
        popup.addButton('privacyButton','extralong_button', 'extralong_button_hover', false, 0, 82 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 255, -247  + yOffset);
        popup.addButton('termsButton','extralong_button', 'extralong_button_hover', false, 0, 192 + yOffset);

        popup['privacyButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['privacyButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['termsButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['termsButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // privacy ant terms buttons text
        popup.privacyText = popup.scene.add.bitmapText(0, 72 + yOffset, 'gameFont_1', 'PRIVACY POLICY', 43, 1).setOrigin(0.5);
        popup.privacyText.tint = 0xFFFFFF;
        popup.add(popup.privacyText);

        popup.termsText = popup.scene.add.bitmapText(0, 182 + yOffset, 'gameFont_1', 'TERMS OF USE', 43, 1).setOrigin(0.5);
        popup.privacyText.tint = 0xFFFFFF;
        popup.add(popup.termsText);
    },

    createFreeGamesPUHandler(popup)
    {
    // add background and panel
    let backGround = popup.scene.add.sprite(0, 0, 'pu_background').setOrigin(0.5).setScale(300);
    backGround.setInteractive(); // block bottom controls
    popup.add(backGround);
    backGround.setAlpha(0.5);
    let panel = popup.scene.add.sprite(0, 0, 'message_panel').setOrigin(0.5);
    popup.add(panel);

    // add caption
    popup.captionText = popup.scene.add.bitmapText(0, -80, 'gameFont_2', 'START FREE GAME', 33, 1).setOrigin(0.5);
    popup.captionText.tint = 0xFFFFFF;
    popup.add(popup.captionText);

    // add message
    popup.messageText = popup.scene.add.bitmapText(0, -10, 'gameFont_1', popup.scene.winSpins, 33, 1).setOrigin(0.5);
    popup.messageText.tint = 0xFFFFFF;
    popup.add(popup.messageText);

    // add buttons
    popup.addButton('okButton','middle_button', 'middle_button_hover', false, 0, 170);
    popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
    popup['okButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});
    // add button text
    popup.okText = popup.scene.add.bitmapText(0, 160, 'gameFont_1', 'OK', 38, 1).setOrigin(0.5);
    popup.okText.tint = 0xFFFFFF;
    popup.add(popup.okText);
},
}

