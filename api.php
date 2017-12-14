<?php
$servername="localhost";
$dbusername="root";
$dbpassword="root";
$dbname="Barname";
$consignmentNo=$_GET['id'];
//$consignmentNo="54100003992525101";
$conn = new mysqli($servername,$dbusername,$dbpassword,$dbname);
$ress = $conn->query("SELECT TermsOfPayment,InvValue,fld_Manual_Cost,fld_Lab_Cost,fld_Pack_Cost,fld_Agency_Cost_From,fld_Agency_Cost,fld_Manual_Insurance,fld_Charge_Cost,fld_Manual_VAT FROM tbl_cons WHERE ConsignmentNo = '$consignmentNo' LIMIT 1");
if($ress->num_rows >0)
{
	while($row = $ress->fetch_assoc())
	{
		$fld_Total_Cost=$row['fld_Manual_Cost']+$row['fld_Lab_Cost']+$row['fld_Pack_Cost']+$row['fld_Agency_Cost_From']+$row['fld_Manual_Insurance']+$row['fld_Charge_Cost']+$row['fld_Manual_VAT'];
		 $return_arr = array("notFound" => false,"TermsOfPayment" => $row['TermsOfPayment'],"InvValue" => $row['InvValue'],"fld_Total_Cost"=>$fld_Total_Cost);
	}
}else{
	$return_arr=array("notFound" => true);
}
echo json_encode($return_arr);
?>