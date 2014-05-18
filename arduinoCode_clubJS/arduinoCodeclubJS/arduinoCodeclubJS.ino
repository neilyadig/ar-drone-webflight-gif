int sensorPin = A0;
int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin,OUTPUT);
}



void loop() {
  if (analogRead(sensorPin) > 1000) {
    Serial.println("FUCKING LAUNCH");
 // Serial.print( analogRead(sensorPin));
 // Serial.println("n");
  }
  
  
  
  if(Serial.available() > 0){
    char inByte;
    while(Serial.available() > 0){
      inByte = Serial.read();
    }
    
    if(inByte=='1'){
      digitalWrite(ledPin,HIGH);
    }
    else{
      digitalWrite(ledPin,LOW);
    }
  }
  
  delay(3000);   
}
