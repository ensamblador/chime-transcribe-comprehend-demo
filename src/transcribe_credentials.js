const keys = {
    "access_key": "AKIA4JJ5LINIGF6K6UT3",
    "secret_key": "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"
};

/* TODO
Para obtener access_key y secret_key debe:
1. Crear un usuario IAM con sólo acceso programático 
2. En el usuario, en la pestaña permisos agregar la siguiente política inline y guardar

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "transcribestreaming",
            "Effect": "Allow",
            "Action": "transcribe:StartStreamTranscriptionWebSocket",
            "Resource": "*"
        }
    ]
}

3. En el usuario, security credentials haga click en el boton "create access key"
4. Copie los valores en el objeto más abajo

*/

/* const keys = {
    "access_key": "", 
    "secret_key": ""
}; */

function Exceptionkeys (mensaje) {
    this.mensaje = mensaje;
    this.nombre = "Exceptionkeys";
    this.toString = function() {
        return this.nombre + this.mensaje
     };
 }



if (keys.access_key === "") {
    throw new Exceptionkeys('Debe utilizar sus propias Keys \n1. Cree un usuario IAM con permiso "transcribe:StartStreamTranscriptionWebSocket"\n2. Genere access_key y secret_key\n3. Guarde estos datos en el archivo transcribe_credentials.js ')

}

export default keys;