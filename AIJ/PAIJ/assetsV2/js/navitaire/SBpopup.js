function ventanaBanco(MethodCode,ACCNO,AMT,CVV,Month,Year,HolderName,retURL) {
			
			var specs = "width=680, height=640, top=5, right=10, resizable=yes,scrollbars=yes";
			var ArrayTarjeta = new Array();
			var today = new Date();
           
            /* Validamos si la funcion es llamada desde miJet */

			ArrayTarjeta["MethodCode"] = MethodCode;
			ArrayTarjeta["ACCNO"]      = ACCNO;
			ArrayTarjeta["AMT"]        = AMT;
			ArrayTarjeta["CVV"]        = CVV;
			ArrayTarjeta["Month"]      = Month;
			ArrayTarjeta["Year"]       = Year;
			ArrayTarjeta["HolderName"] = HolderName;
			ArrayTarjeta["Reference3D"] = s4() + s4() + today.getHours() + today.getMinutes() + today.getSeconds();

		
			if (ArrayTarjeta["MethodCode"] == "VI"){
			ArrayTarjeta["MethodCode"] = "VISA";}
			if (ArrayTarjeta["MethodCode"] == "MC"){
			ArrayTarjeta["MethodCode"] = "MC";}
			
					
			ventana = window.open("TDSecure.aspx","codSeg",specs);
			ventana.document.write('<form name="payinfo" action="https://eps.banorte.com/secure3d/Solucion3DSecure.htm" method="POST">');
            
            //Constantes
            ventana.document.write('  <input type="hidden" name="MerchantId" value="9799800">');
			ventana.document.write('  <input type="hidden" name="MerchantName" value="Interjet">');
			ventana.document.write('  <input type="hidden" name="MerchantCity" value="Mexico">');
			ventana.document.write('  <input type="hidden" name="Cert3D" value="03">');

            //ForwardPaths
            //Producción
 			//ventana.document.write('  <input type="hidden" name="ForwardPath" value="http://'+ document.domain +':88/' +retURL+ '.aspx">');
            //TEST NAVITAIRE
		    //ventana.document.write('  <input type="hidden" name="ForwardPath" value="http://172.27.50.71/' +retURL+ '.aspx">');
            //TEST
			ventana.document.write('  <input type="hidden" name="ForwardPath" value="http://172.27.138.153/' +retURL+ '.aspx">');
  
 			//Variables
            ventana.document.write('  <input type="hidden" name="CardType" value="'+ ArrayTarjeta["MethodCode"]  +'"/>');
            ventana.document.write('  <input type="hidden" name="Card" maxlength="16" value="' + ArrayTarjeta["ACCNO"] + '"/>');
			ventana.document.write('  <input type="hidden" name="Expires" value="' + ArrayTarjeta["Month"] + '/'  + ArrayTarjeta["Year"] + '" />');
			ventana.document.write('  <input type="hidden" name="Total" maxlength="16" value="' + ArrayTarjeta["AMT"] + '" />');
			ventana.document.write('  <input type="hidden" name="Reference3D" value="' + ArrayTarjeta["Reference3D"] + '">');
			ventana.document.write('</form>');
			ventana.document.write('<script>');
			ventana.document.write('document.payinfo.method = "POST";');
			ventana.document.write('document.payinfo.action = "https://eps.banorte.com/secure3d/Solucion3DSecure.htm";');
			ventana.document.write('document.payinfo.submit();');
				
			ventana.document.write('</script>');
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1).toUpperCase();
}