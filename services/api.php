<?php
        include("upgrade.php");
 	require_once("Rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "localhost";
		const DB_USER = "om";
		const DB_PASSWORD = "N3wQA3ra.";
		const DB = "marketplace";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
			$this->mysqli->set_charset("utf8");
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
//echo $_REQUEST['x'];
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else {
				$this->response('',404); // If the method not exist with in this class "Page not found".
			}
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$email = $this->_request['email'];		
			$password = $this->_request['pwd'];
			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}
		
		private function mappings(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$type = $this->_request['type'];

			$query = $this->getMappingsQuery($type);
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
//echo 'num_rows: '.$r->num_rows."\n";

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}

			$this->response('',204);	// If no records "No Content" status
		}

                private function getMappingsQuery($type){
                        if ($type == 'adobe') {
                                $query="SELECT a.adobe_segment_id, a.dp_key_id FROM marketplace.adobe_dpkey_mapping a order by a.adobe_segment_id";
                        }
                        else if ($type == 'liveramp-dp') {
                                $query="SELECT a.dp_name, a.dp_id, a.threshold_mb FROM marketplace.liveramp_dp_mappings a order by a.dp_name";
                        }
                        else if ($type == 'liveramp-key') {
                                $query="SELECT a.liveramp_segment_id, a.dp_key_id, a.value FROM marketplace.liveramp_dpkey_mappings a order by a.dp_key_id";
                        }
                        else if ($type == 'facebook-pixel') {
                                $query="SELECT a.dp_id, a.facebook_pixel_id FROM marketplace.data_provider_facebook_pixels a order by a.dp_id";
                        }
                        else if ($type == 'facebook-dp') {
                                $query="SELECT a.id, a.name, a.sync_facebook FROM marketplace.data_providers a order by a.id";
                        }
                        else if ($type == 'facebook-key') {
                                $query="SELECT a.key_id, a.enabled, a.update_interval, a.use_image_pixel FROM marketplace.facebook_dp_keys a order by a.key_id";
                        }

                        return $query;
                }

		private function mapping(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$type = $this->_request['type'];
//echo 'type='.$type."\n";

			if ( ($id>0) || ($id!='0') ) {	
//echo 'id>0'."\n";
				$query = $this->getMappingQuery($type);
				$query = $query . "'".$id."'";
//echo 'query='.$query."\n";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send mapping details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}

                private function getMappingQuery($type){
                        if ($type == 'adobe') {
                                $query="SELECT a.adobe_segment_id, a.dp_key_id FROM marketplace.adobe_dpkey_mapping a where a.adobe_segment_id=";
                        }
                        else if ($type == 'liveramp-dp') {
                                $query="SELECT a.dp_name, a.dp_id, a.threshold_mb FROM marketplace.liveramp_dp_mappings a where a.dp_name=";
                        }
                        else if ($type == 'liveramp-key') {
                                $query="SELECT a.liveramp_segment_id, a.dp_key_id, a.value FROM marketplace.liveramp_dpkey_mappings a where a.liveramp_segment_id=";
                        }
                        else if ($type == 'facebook-pixel') {
                                $query="SELECT a.dp_id, a.facebook_pixel_id FROM marketplace.data_provider_facebook_pixels a where a.dp_id=";
                        }
                        else if ($type == 'facebook-dp') {
                                $query="SELECT a.id, a.name, a.sync_facebook FROM marketplace.data_providers a where a.id=";
                        }
                        else if ($type == 'facebook-key') {
                                $query="SELECT a.key_id, a.enabled, a.update_interval, a.use_image_pixel FROM marketplace.facebook_dp_keys a where a.key_id=";
                        }

                        return $query;
                }
		
		private function insertMapping(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$message = json_decode(file_get_contents("php://input"),true);
			$mapping = $message['mapping'];
			$type = $message['type'];
			$query = $this->getInsertQuery($mapping, $type);
//echo "query=".$query."\n";

			if(!empty($mapping)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Customer Created Successfully.", "data" => $mapping);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}

		private function getInsertQuery($mapping, $type) {
			if ($type == 'adobe') {
	 			$column_names = array('adobe_segment_id', 'dp_key_id');
				$keys = array_keys($mapping);
				$columns = '';
				$values = '';
				foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
				   	if(!in_array($desired_key, $keys)) {
				   		$$desired_key = '';
					}else{
						$$desired_key = $mapping[$desired_key];
					}
					$columns = $columns.$desired_key.',';
					$values = $values."'".$$desired_key."',";
				}
				$query = "INSERT INTO marketplace.adobe_dpkey_mapping(".trim($columns,',').") VALUES(".trim($values,',').")";
			}
			else if ($type == 'liveramp-dp') {
	 			$column_names = array('dp_name', 'dp_id', 'threshold_mb');
				$keys = array_keys($mapping);
				$columns = '';
				$values = '';
				foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
				   	if(!in_array($desired_key, $keys)) {
				   		$$desired_key = '';
					}else{
						$$desired_key = $mapping[$desired_key];
					}
					$columns = $columns.$desired_key.',';
					$values = $values."'".$$desired_key."',";
				}
				$query = "INSERT INTO marketplace.liveramp_dp_mappings(".trim($columns,',').") VALUES(".trim($values,',').")";
			}
			else if ($type == 'liveramp-key') {
	 			$column_names = array('liveramp_segment_id', 'dp_key_id', 'value');
				$keys = array_keys($mapping);
				$columns = '';
				$values = '';
				foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
				   	if(!in_array($desired_key, $keys)) {
				   		$$desired_key = '';
					}else{
						$$desired_key = $mapping[$desired_key];
					}
					$columns = $columns.$desired_key.',';
					$values = $values."'".$$desired_key."',";
				}
				$query = "INSERT INTO marketplace.liveramp_dpkey_mappings(".trim($columns,',').") VALUES(".trim($values,',').")";
			}
			else if ($type == 'facebook-pixel') {
	 			$column_names = array('dp_id', 'facebook_pixel_id');
				$keys = array_keys($mapping);
				$columns = '';
				$values = '';
				foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
				   	if(!in_array($desired_key, $keys)) {
				   		$$desired_key = '';
					}else{
						$$desired_key = $mapping[$desired_key];
					}
					$columns = $columns.$desired_key.',';
					$values = $values."'".$$desired_key."',";
				}
				$query = "INSERT INTO marketplace.data_provider_facebook_pixels(".trim($columns,',').") VALUES(".trim($values,',').")";
			}
			else if ($type == 'facebook-key') {
	 			$column_names = array('key_id', 'enabled', 'update_interval', 'use_image_pixel');
				$keys = array_keys($mapping);
				$columns = '';
				$values = '';
				foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
				   	if(!in_array($desired_key, $keys)) {
				   		$$desired_key = '';
					}else{
						$$desired_key = $mapping[$desired_key];
					}
					$columns = $columns.$desired_key.',';
					if ($$desired_key == '') {
						$values = $values."NULL,";
					}
					else {
						$values = $values."'".$$desired_key."',";
					}
				}
				$query = "INSERT INTO marketplace.facebook_dp_keys(".trim($columns,',').") VALUES(".trim($values,',').")";
			}

			return $query;
		}

		private function updateMapping(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$message = json_decode(file_get_contents("php://input"),true);
			$id = $message['id'];
			$type = $message['type'];
			$mapping = $message['mapping'];

			$query = $this->getUpdateQuery($mapping, $type)."'".$id."'";
//echo "query=".$query."\n";

			if(!empty($mapping)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Mapping".$id." Updated Successfully.", "data" => $mapping);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}

		private function getUpdateQuery($mapping, $type) {
		    if ($type == 'adobe') {
                        $column_names = array('adobe_segment_id', 'dp_key_id');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }
                                $columns = $columns.$desired_key."='".$$desired_key."',";
                        }
                        $query = "UPDATE marketplace.adobe_dpkey_mapping SET ".trim($columns,',')." WHERE adobe_segment_id=";
		    }
		    else if ($type == 'liveramp-dp') {
                        $column_names = array('dp_name', 'dp_id', 'threshold_mb');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }
                                $columns = $columns.$desired_key."='".$$desired_key."',";
                        }
                        $query = "UPDATE marketplace.liveramp_dp_mappings SET ".trim($columns,',')." WHERE dp_name=";
		    }
		    else if ($type == 'liveramp-key') {
                        $column_names = array('liveramp_segment_id', 'dp_key_id', 'value');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }
                                $columns = $columns.$desired_key."='".$$desired_key."',";
                        }
                        $query = "UPDATE marketplace.liveramp_dpkey_mappings SET ".trim($columns,',')." WHERE liveramp_segment_id=";
		    }
		    else if ($type == 'facebook-pixel') {
                        $column_names = array('dp_id', 'facebook_pixel_id');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }
                                $columns = $columns.$desired_key."='".$$desired_key."',";
                        }
                        $query = "UPDATE marketplace.data_provider_facebook_pixels SET ".trim($columns,',')." WHERE dp_id=";
		    }
		    else if ($type == 'facebook-dp') {
                        $column_names = array('id', 'name', 'sync_facebook');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }
                                $columns = $columns.$desired_key."='".$$desired_key."',";
                        }
                        $query = "UPDATE marketplace.data_providers SET ".trim($columns,',')." WHERE id=";
		    }
		    else if ($type == 'facebook-key') {
                        $column_names = array('key_id', 'enabled', 'update_interval', 'use_image_pixel');
                        $keys = array_keys($mapping);
                        $columns = '';
                        $values = '';
                        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
                           	if(!in_array($desired_key, $keys)) {
                                        $$desired_key = '';
                                }else{
                                        $$desired_key = $mapping[$desired_key];
                                }

				if ($$desired_key == '') {
                                	$columns = $columns.$desired_key."=NULL,";
				}
				else {
                                	$columns = $columns.$desired_key."='".$$desired_key."',";
				}
                        }
                        $query = "UPDATE marketplace.facebook_dp_keys SET ".trim($columns,',')." WHERE key_id=";
//echo "query is: ".$query."\n";
		    }

		    return $query;
		}

		private function deleteMapping(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$type = $this->_request['type'];
//echo "id=".$id."\n";
			if ( ($id>0) || ($id!='0') ) {				
				$query = $this->getDeleteQuery($type)."'".$id."'";
//echo "query=".$query."\n";

				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);

			}else
				$this->response('',204);	// If no records "No Content" status
		}

		private function getDeleteQuery($type) {
//echo "type=".$type."\n";
			if ($type == 'adobe') {
				$query = "DELETE FROM marketplace.adobe_dpkey_mapping WHERE adobe_segment_id = ";	
			}
			else if ($type == 'liveramp-dp') {
				$query = "DELETE FROM marketplace.liveramp_dp_mappings WHERE dp_name= ";	
			}
			else if ($type == 'liveramp-key') {
				$query = "DELETE FROM marketplace.liveramp_dpkey_mappings WHERE liveramp_segment_id = ";	
			}
			else if ($type == 'facebook-pixel') {
				$query = "DELETE FROM marketplace.data_provider_facebook_pixels WHERE dp_id = ";	
			}
			else if ($type == 'facebook-key') {
				$query = "DELETE FROM marketplace.facebook_dp_keys WHERE key_id = ";	
			}

			return $query;
		}

		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				$ret = json_encode($data);
/*
switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
}
echo PHP_EOL;
*/
				return $ret;
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>
