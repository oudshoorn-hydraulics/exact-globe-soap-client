export const WsdlEntity = `<?xml version="1.0" encoding="utf-8"?>
<wsdl:definitions name="EntityWinService" targetNamespace="http://www.exactsoftware.com/services/entities/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="http://www.exactsoftware.com/services/entities/" xmlns:wsa10="http://www.w3.org/2005/08/addressing" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">
    <wsp:Policy wsu:Id="BasicHttpBinding_entity_policy">
        <wsp:ExactlyOne>
            <wsp:All>
                <wsp:ExactlyOne>
                    <http:NegotiateAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                    <http:NtlmAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                </wsp:ExactlyOne>
            </wsp:All>
        </wsp:ExactlyOne>
    </wsp:Policy>
    <wsdl:types>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/services/entities/" xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <xs:import namespace="http://www.exactsoftware.com/schemas/entities/"/>
            <xs:element name="Create">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q1:EntityData" xmlns:q1="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="CreateResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="CreateResult" nillable="true" type="q2:EntityData" xmlns:q2="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="Retrieve">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q3:EntityData" xmlns:q3="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="RetrieveResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="RetrieveResult" nillable="true" type="q4:EntityData" xmlns:q4="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="Update">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q5:EntityData" xmlns:q5="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="UpdateResponse">
                <xs:complexType>
                    <xs:sequence/>
                </xs:complexType>
            </xs:element>
            <xs:element name="Delete">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q6:EntityData" xmlns:q6="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="DeleteResponse">
                <xs:complexType>
                    <xs:sequence/>
                </xs:complexType>
            </xs:element>
            <xs:element name="Save">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q7:EntityData" xmlns:q7="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="SaveResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="SaveResult" nillable="true" type="q8:EntityData" xmlns:q8="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="Validate">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q9:EntityData" xmlns:q9="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="ValidateResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="ValidateResult" nillable="true" type="q10:EntityData" xmlns:q10="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="OpenNew">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q11:EntityData" xmlns:q11="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="OpenNewResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="OpenNewResult" nillable="true" type="q12:EntityData" xmlns:q12="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
        <xs:schema attributeFormDefault="qualified" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://schemas.microsoft.com/2003/10/Serialization/">
            <xs:element name="anyType" nillable="true" type="xs:anyType"/>
            <xs:element name="anyURI" nillable="true" type="xs:anyURI"/>
            <xs:element name="base64Binary" nillable="true" type="xs:base64Binary"/>
            <xs:element name="boolean" nillable="true" type="xs:boolean"/>
            <xs:element name="byte" nillable="true" type="xs:byte"/>
            <xs:element name="dateTime" nillable="true" type="xs:dateTime"/>
            <xs:element name="decimal" nillable="true" type="xs:decimal"/>
            <xs:element name="double" nillable="true" type="xs:double"/>
            <xs:element name="float" nillable="true" type="xs:float"/>
            <xs:element name="int" nillable="true" type="xs:int"/>
            <xs:element name="long" nillable="true" type="xs:long"/>
            <xs:element name="QName" nillable="true" type="xs:QName"/>
            <xs:element name="short" nillable="true" type="xs:short"/>
            <xs:element name="string" nillable="true" type="xs:string"/>
            <xs:element name="unsignedByte" nillable="true" type="xs:unsignedByte"/>
            <xs:element name="unsignedInt" nillable="true" type="xs:unsignedInt"/>
            <xs:element name="unsignedLong" nillable="true" type="xs:unsignedLong"/>
            <xs:element name="unsignedShort" nillable="true" type="xs:unsignedShort"/>
            <xs:element name="char" nillable="true" type="tns:char"/>
            <xs:simpleType name="char">
                <xs:restriction base="xs:int"/>
            </xs:simpleType>
            <xs:element name="duration" nillable="true" type="tns:duration"/>
            <xs:simpleType name="duration">
                <xs:restriction base="xs:duration">
                    <xs:pattern value="\\-?P(\\d*D)?(T(\\d*H)?(\\d*M)?(\\d*(\\.\\d*)?S)?)?"/>
                    <xs:minInclusive value="-P10675199DT2H48M5.4775808S"/>
                    <xs:maxInclusive value="P10675199DT2H48M5.4775807S"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:element name="guid" nillable="true" type="tns:guid"/>
            <xs:simpleType name="guid">
                <xs:restriction base="xs:string">
                    <xs:pattern value="[\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12}"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:attribute name="FactoryType" type="xs:QName"/>
            <xs:attribute name="Id" type="xs:ID"/>
            <xs:attribute name="Ref" type="xs:IDREF"/>
        </xs:schema>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/schemas/entities/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.exactsoftware.com/schemas/entities/">
            <xs:complexType name="EntityData">
                <xs:sequence>
                    <xs:element minOccurs="0" name="EntityName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Properties" nillable="true" type="tns:ArrayOfPropertyData"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="EntityData" nillable="true" type="tns:EntityData"/>
            <xs:complexType name="ArrayOfPropertyData">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="PropertyData" nillable="true" type="tns:PropertyData"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfPropertyData" nillable="true" type="tns:ArrayOfPropertyData"/>
            <xs:complexType name="PropertyData">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="NoRights" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="Value" nillable="true" type="xs:anyType"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="PropertyData" nillable="true" type="tns:PropertyData"/>
        </xs:schema>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/schemas/faults/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.exactsoftware.com/schemas/faults/">
            <xs:complexType name="EntityFault">
                <xs:complexContent mixed="false">
                    <xs:extension base="tns:WSExactBaseFault">
                        <xs:sequence>
                            <xs:element minOccurs="0" name="DateTime" type="xs:dateTime"/>
                            <xs:element minOccurs="0" name="Exceptions" nillable="true" type="tns:ArrayOfWSExceptionInfo"/>
                            <xs:element minOccurs="0" name="Source" nillable="true" type="xs:string"/>
                            <xs:element minOccurs="0" name="TermID" type="xs:int"/>
                            <xs:element minOccurs="0" name="User" nillable="true" type="xs:string"/>
                        </xs:sequence>
                    </xs:extension>
                </xs:complexContent>
            </xs:complexType>
            <xs:element name="EntityFault" nillable="true" type="tns:EntityFault"/>
            <xs:complexType name="WSExactBaseFault">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Message" nillable="true" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="WSExactBaseFault" nillable="true" type="tns:WSExactBaseFault"/>
            <xs:complexType name="ArrayOfWSExceptionInfo">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="WSExceptionInfo" nillable="true" type="tns:WSExceptionInfo"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfWSExceptionInfo" nillable="true" type="tns:ArrayOfWSExceptionInfo"/>
            <xs:complexType name="WSExceptionInfo">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Message" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="PropertyName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="TermID" type="xs:int"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="WSExceptionInfo" nillable="true" type="tns:WSExceptionInfo"/>
        </xs:schema>
    </wsdl:types>
    <wsdl:message name="entity_Create_InputMessage">
        <wsdl:part name="parameters" element="tns:Create"/>
    </wsdl:message>
    <wsdl:message name="entity_Create_OutputMessage">
        <wsdl:part name="parameters" element="tns:CreateResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Create_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q1:EntityFault" xmlns:q1="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_Retrieve_InputMessage">
        <wsdl:part name="parameters" element="tns:Retrieve"/>
    </wsdl:message>
    <wsdl:message name="entity_Retrieve_OutputMessage">
        <wsdl:part name="parameters" element="tns:RetrieveResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Retrieve_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q2:EntityFault" xmlns:q2="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_Update_InputMessage">
        <wsdl:part name="parameters" element="tns:Update"/>
    </wsdl:message>
    <wsdl:message name="entity_Update_OutputMessage">
        <wsdl:part name="parameters" element="tns:UpdateResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Update_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q3:EntityFault" xmlns:q3="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_Delete_InputMessage">
        <wsdl:part name="parameters" element="tns:Delete"/>
    </wsdl:message>
    <wsdl:message name="entity_Delete_OutputMessage">
        <wsdl:part name="parameters" element="tns:DeleteResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Delete_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q4:EntityFault" xmlns:q4="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_Save_InputMessage">
        <wsdl:part name="parameters" element="tns:Save"/>
    </wsdl:message>
    <wsdl:message name="entity_Save_OutputMessage">
        <wsdl:part name="parameters" element="tns:SaveResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Save_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q5:EntityFault" xmlns:q5="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_Validate_InputMessage">
        <wsdl:part name="parameters" element="tns:Validate"/>
    </wsdl:message>
    <wsdl:message name="entity_Validate_OutputMessage">
        <wsdl:part name="parameters" element="tns:ValidateResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_Validate_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q6:EntityFault" xmlns:q6="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:message name="entity_OpenNew_InputMessage">
        <wsdl:part name="parameters" element="tns:OpenNew"/>
    </wsdl:message>
    <wsdl:message name="entity_OpenNew_OutputMessage">
        <wsdl:part name="parameters" element="tns:OpenNewResponse"/>
    </wsdl:message>
    <wsdl:message name="entity_OpenNew_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q7:EntityFault" xmlns:q7="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:portType name="entity">
        <wsdl:operation name="Create">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Create" message="tns:entity_Create_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/CreateResponse" message="tns:entity_Create_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/CreateEntityFaultFault" name="EntityFaultFault" message="tns:entity_Create_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="Retrieve">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Retrieve" message="tns:entity_Retrieve_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/RetrieveResponse" message="tns:entity_Retrieve_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/RetrieveEntityFaultFault" name="EntityFaultFault" message="tns:entity_Retrieve_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="Update">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Update" message="tns:entity_Update_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/UpdateResponse" message="tns:entity_Update_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/UpdateEntityFaultFault" name="EntityFaultFault" message="tns:entity_Update_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="Delete">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Delete" message="tns:entity_Delete_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/DeleteResponse" message="tns:entity_Delete_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/DeleteEntityFaultFault" name="EntityFaultFault" message="tns:entity_Delete_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="Save">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Save" message="tns:entity_Save_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/SaveResponse" message="tns:entity_Save_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/SaveEntityFaultFault" name="EntityFaultFault" message="tns:entity_Save_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="Validate">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/Validate" message="tns:entity_Validate_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/ValidateResponse" message="tns:entity_Validate_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/ValidateEntityFaultFault" name="EntityFaultFault" message="tns:entity_Validate_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
        <wsdl:operation name="OpenNew">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entity/OpenNew" message="tns:entity_OpenNew_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entity/OpenNewResponse" message="tns:entity_OpenNew_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entity/OpenNewEntityFaultFault" name="EntityFaultFault" message="tns:entity_OpenNew_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding_entity" type="tns:entity">
        <wsp:PolicyReference URI="#BasicHttpBinding_entity_policy"/>
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="Create">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Create" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="Retrieve">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Retrieve" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="Update">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Update" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="Delete">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Delete" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="Save">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Save" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="Validate">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/Validate" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="OpenNew">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entity/OpenNew" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="EntityWinService">
        <wsdl:port name="BasicHttpBinding_entity" binding="tns:BasicHttpBinding_entity">
            <soap:address location="http://virtueel2.oudshoornbv.local:8010/services/Exact.Entity.EG"/>
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>`;
